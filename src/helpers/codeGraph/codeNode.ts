// codeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/node.ts

import Mustache from "mustache";

import { AbstractNode, INodeState, NodeInterface, NodeInterfaceDefinition } from "baklavajs";
import { BaseCode } from "../code/code";
import { TConnection, TNode } from "@/types";

export abstract class AbstractCodeNode extends AbstractNode {
  abstract inputs: Record<string, NodeInterface<any>>;
  abstract outputs: Record<string, NodeInterface<any>>;

  private _code: BaseCode | undefined;
  private _hidden: boolean = false;
  private _script: string = "";
  private _networkItem: TNode | TConnection | undefined;

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

  get codeTemplate(): string {
    return "";
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get idx(): number {
    return this.graph?.nodes.indexOf(this) ?? -1;
  }

  get indexOfNodeType(): number {
    const nodeIds = this.graph?.nodes.filter((node) => node.type === this.type).map((node) => node.id);
    if (nodeIds) return nodeIds.indexOf(this.id);
    return -1;
  }

  get label(): string {
    return this.variableName + (this.indexOfNodeType + 1);
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

  get node(): AbstractCodeNode {
    return this;
  }

  get script(): string {
    return this._script;
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
    this._script = Mustache.render(this.codeTemplate, this);
    if (this.getConnectedNodesByInterface("out").length > 0) {
      this._script = `${this.label} = ${this._script}`;
    }

    if (this.hidden) {
      this._script = "# " + this._script;
      this._script = this._script.replaceAll("\n", "\n# ");
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
