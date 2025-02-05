// codeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/node.ts

import Mustache from "mustache";
import { AbstractNode, INodeState, NodeInterface, NodeInterfaceDefinition } from "baklavajs";
import { reactive, UnwrapRef } from "vue";

import { BaseCode } from "../code/code";
import { TConnection, TNode, TSimulation } from "@/types";

interface IAbstractCodeNodeState {
  hidden: boolean;
  integrated: boolean;
  position: "auto" | "top" | "bottom";
  script: string;
}

export abstract class AbstractCodeNode extends AbstractNode {
  abstract inputs: Record<string, NodeInterface<any>>;
  abstract outputs: Record<string, NodeInterface<any>>;

  private _code: BaseCode | undefined;
  private _networkItem: TNode | TConnection | undefined;
  private _simulationItem: TSimulation | undefined;
  private _state: UnwrapRef<IAbstractCodeNodeState> = reactive({
    hidden: false,
    integrated: false,
    position: "auto",
    script: "",
  });

  public modules: string[] = [];
  public variableName: string = "x";

  constructor() {
    super();

    // this.initializeIo();
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  set code(value: BaseCode) {
    this._code = value;
  }

  abstract get codeTemplate(): string;

  get idx(): number {
    return this.code?.graph?.nodesSegregated.indexOf(this) ?? -1;
  }

  get idxByVariableNames(): number {
    return this.code?.graph?.getNodesBySameVariableNames(this.variableName).indexOf(this) ?? -1;
  }

  get indexOfNodeType(): number {
    const nodeIds = this.code?.graph.nodesSegregated
      .filter((node: AbstractCodeNode) => node.type === this.type)
      .map((node: AbstractCodeNode) => node.id);
    if (nodeIds) return nodeIds.indexOf(this.id);
    return -1;
  }

  get label(): string {
    return this.variableName + (this.idxByVariableNames + 1);
  }

  get networkConnection(): TConnection | undefined {
    return this._networkItem as TConnection;
  }

  get networkNode(): TNode | undefined {
    return this._networkItem as TNode;
  }

  get networkItem(): TNode | TConnection | undefined {
    return this._networkItem;
  }

  set networkItem(value: TNode | TConnection) {
    this._networkItem = value;
  }

  get nOutputs(): number {
    return Object.keys(this.outputs).length;
  }

  get node(): AbstractCodeNode {
    return this;
  }

  get script(): string {
    return this._state.script;
  }

  get simulationItem(): TSimulation | undefined {
    return this._simulationItem;
  }

  set simulationItem(value: TSimulation | TConnection) {
    this._simulationItem = value;
  }

  get state(): UnwrapRef<IAbstractCodeNodeState> {
    return this._state;
  }

  // calculate?: CalculateFunction<any, any> | undefined;

  /**
   * Get connected nodes to the node.
   */
  getConnectedNodes(mode?: string): AbstractCodeNode[] {
    let nodeIds: string[] = [];
    if (mode != "outputs") {
      const sources = this.graph?.connections.filter((c) => c.to.nodeId === this.id).map((c) => c.from.nodeId);
      if (sources) nodeIds = nodeIds.concat(sources);
    }
    if (mode != "inputs") {
      const targets = this.graph?.connections.filter((c) => c.from.nodeId === this.id).map((c) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected node to the node interface.
   * @param nodeInterface string
   * @returns code node instance
   */
  getConnectedNodesByInterface(nodeInterface: string): AbstractCodeNode[] {
    let nodeIds: string[] = [];
    if (nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter((c) => c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id)
        .map((c) => c.from.nodeId);
      if (sources) nodeIds = nodeIds.concat(sources);
    } else if (nodeInterface in this.outputs) {
      const targets = this.graph?.connections
        .filter((c) => c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id)
        .map((c) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Render code of this node.
   */
  renderCode(): void {
    this._state.script = Mustache.render(this.codeTemplate, this);
    if (this.getConnectedNodesByInterface("out").length > 0) {
      this._state.script = `${this.label} = ${this._state.script}`;
    }

    if (this._state.hidden) {
      this._state.script = "# " + this._state.script;
      this._state.script = this._state.script.replaceAll("\n", "\n# ");
    }
  }
}

export abstract class CodeNode<I, O> extends AbstractCodeNode {
  abstract inputs: NodeInterfaceDefinition<I>;
  abstract outputs: NodeInterfaceDefinition<O>;

  public load(state: INodeState<I, O>): void {
    super.load(state);
  }

  public save(): INodeState<I, O> {
    return super.save();
  }
  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  // public calculate?: CalculateFunction<I, O>;
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode;
