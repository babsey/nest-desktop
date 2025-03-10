// dynamicCodeNode.ts

import {
  INodeState,
  NodeInterface,
  NodeInterfaceDefinition,
  InterfaceFactory,
  IDynamicNodeDefinition,
} from "baklavajs";

import { AbstractCodeNode, CodeNode } from "./codeNode";
import { BaseCode } from "../code/code";

type Dynamic<T> = T & Record<string, any>;

/**
 * @internal
 * Abstract base class for every dynamic node
 */
export abstract class DynamicCodeNode<I, O> extends CodeNode<Dynamic<I>, Dynamic<O>> {
  public abstract inputs: NodeInterfaceDefinition<Dynamic<I>>;
  public abstract outputs: NodeInterfaceDefinition<Dynamic<O>>;

  public abstract load(state: INodeState<Dynamic<I>, Dynamic<O>>): void;

  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  // public calculate?: CalculateFunction<Dynamic<I>, Dynamic<O>>;
}

export type DynamicNodeDefinition = Record<string, (() => NodeInterface<any>) | undefined>;
export interface DynamicNodeUpdateResult {
  inputs?: DynamicNodeDefinition;
  outputs?: DynamicNodeDefinition;
  forceUpdateInputs?: string[];
  forceUpdateOutputs?: string[];
}

export interface IDynamicCodeNodeDefinition<I, O> extends IDynamicNodeDefinition<I, O> {
  code?: BaseCode;
  codeTemplate?: (node?: AbstractCodeNode) => string;
  node?: AbstractCodeNode;
  modules?: string[];
  variableName?: string;
}

export function defineDynamicCodeNode<I, O>(
  definition: IDynamicCodeNodeDefinition<I, O>,
): new () => DynamicCodeNode<I, O> {
  return class extends DynamicCodeNode<I, O> {
    public readonly type = definition.type;
    public inputs = {} as NodeInterfaceDefinition<Dynamic<I>>;
    public outputs = {} as NodeInterfaceDefinition<Dynamic<O>>;
    public calculate;

    private preventUpdate = false;
    private readonly staticInputKeys = Object.keys(definition.inputs ?? {});
    private readonly staticOutputKeys = Object.keys(definition.outputs ?? {});

    constructor() {
      super();
      this._title = definition.title ?? definition.type;
      if (definition.modules) this.modules = definition.modules;
      if (definition.variableName) this.variableName = definition.variableName;
      this.executeFactory("input", definition.inputs);
      this.executeFactory("output", definition.outputs);

      if (definition.calculate) {
        this.calculate = (inputs: Dynamic<I>, globalValues: any) =>
          definition.calculate?.call(this, inputs, globalValues);
      }

      definition.onCreate?.call(this);
    }

    override get codeTemplate(): string {
      return definition.codeTemplate ? (definition.codeTemplate?.call(this) as string) : "";
    }

    public onPlaced() {
      this.events.update.subscribe(this, (data) => {
        if (!data) return;

        if (
          (data.type === "input" && this.staticInputKeys.includes(data.name)) ||
          (data.type === "output" && this.staticOutputKeys.includes(data.name))
        ) {
          this.onUpdate();
        }
      });
      this.onUpdate();

      definition.onPlaced?.call(this);
    }

    public onDestroy() {
      definition.onDestroy?.call(this);
    }

    public load(state: INodeState<Dynamic<I>, Dynamic<O>>): void {
      // prevent automatic updates during loading
      this.preventUpdate = true;

      this.hooks.beforeLoad.execute(state);
      this.id = state.id;
      this.title = state.title;

      // first load the state for the static interfaces
      for (const k of this.staticInputKeys) {
        this.inputs[k].load(state.inputs[k]);
        this.inputs[k].nodeId = this.id;
      }
      for (const k of this.staticOutputKeys) {
        this.outputs[k].load(state.outputs[k]);
        this.outputs[k].nodeId = this.id;
      }

      // run the update function to correctly generate all interfaces
      this.preventUpdate = false;
      this.onUpdate();
      this.preventUpdate = true;

      // load the state for all generated interfaces
      for (const k of Object.keys(state.inputs)) {
        if (!this.staticInputKeys.includes(k) && this.inputs[k]) {
          this.inputs[k].load(state.inputs[k]);
          this.inputs[k].nodeId = this.id;
        }
      }
      for (const k of Object.keys(state.outputs)) {
        if (!this.staticOutputKeys.includes(k) && this.outputs[k]) {
          this.outputs[k].load(state.outputs[k]);
          this.outputs[k].nodeId = this.id;
        }
      }

      this.preventUpdate = false;
      this.events.loaded.emit(this as any);
    }

    private onUpdate() {
      if (this.preventUpdate) return;

      if (this.graph) this.graph.activeTransactions++;

      const inputValues = this.getStaticValues<I>(this.staticInputKeys, this.inputs);
      const outputValues = this.getStaticValues<O>(this.staticOutputKeys, this.outputs);
      const result = definition.onUpdate.call(this, inputValues, outputValues);
      this.updateInterfaces("input", result.inputs ?? {}, result.forceUpdateInputs ?? []);
      this.updateInterfaces("output", result.outputs ?? {}, result.forceUpdateOutputs ?? []);

      if (this.graph) this.graph.activeTransactions--;

      this.renderCode();
    }

    private getStaticValues<T>(keys: string[], interfaces: Record<string, NodeInterface>): T {
      const values = {} as Record<string, any>;
      for (const k of keys) {
        values[k] = interfaces[k].value;
      }
      return values as T;
    }

    private updateInterfaces(type: "input" | "output", newInterfaces: DynamicNodeDefinition, forceUpdates: string[]) {
      const staticKeys = type === "input" ? this.staticInputKeys : this.staticOutputKeys;
      const currentInterfaces = type === "input" ? this.inputs : this.outputs;

      // remove all interfaces that are outdated
      for (const k of Object.keys(currentInterfaces)) {
        if (staticKeys.includes(k) || (newInterfaces[k] && !forceUpdates.includes(k))) continue;

        if (type === "input") {
          this.removeInput(k);
        } else {
          this.removeOutput(k);
        }
      }

      // add all new interfaces
      for (const k of Object.keys(newInterfaces)) {
        if (currentInterfaces[k]) continue;

        const intf = newInterfaces[k]!();
        if (type === "input") {
          this.addInput(k, intf);
        } else {
          this.addOutput(k, intf);
        }
      }
    }

    private executeFactory<V, T extends InterfaceFactory<V>>(type: "input" | "output", factory?: T): void {
      (Object.keys(factory || {}) as (keyof V)[]).forEach((k) => {
        const intf = factory![k]();
        if (type === "input") {
          this.addInput(k as string, intf);
        } else {
          this.addOutput(k as string, intf);
        }
      });
    }
  };
}
