// codeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/node.ts

import Mustache from "mustache";

import { AbstractNode, INodeState, NodeInterface, NodeInterfaceDefinition } from "baklavajs";
import { BaseCode } from "../code/code";

export abstract class AbstractCodeNode extends AbstractNode {
  abstract inputs: Record<string, NodeInterface<any>>;
  abstract outputs: Record<string, NodeInterface<any>>;

  private _code: BaseCode | undefined;
  public _codeTemplate: () => string = () => "";
  private _script: string = "";

  constructor() {
    super();

    // this.initializeIo();
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  get codeTemplate(): (node?: AbstractCodeNode) => string {
    return this._codeTemplate;
  }

  get label(): string {
    return "n" + (this.indexOfNodeType + 1);
  }

  get indexOfNodeType(): number {
    const nodeIds = this.graph?.nodes.filter((node) => node.type === this.type).map((node) => node.id);
    if (nodeIds) return nodeIds.indexOf(this.id);
    return -1;
  }

  get script(): string {
    return this._script;
  }

  get preNode(): AbstractCodeNode | undefined {
    return this.getSourceNode("pre");
  }

  get postNode(): AbstractCodeNode | undefined {
    return this.getSourceNode("post");
  }

  // get sourceNodes(): AbstractCodeNode[] | undefined {
  //   const connections = this.graph?.connections.filter((c) => c.to.nodeId === this.id);
  //   return connections.map((c) => this.graph?.findNodeById(c.from.nodeId));
  // }

  // get sourceNode(): AbstractCodeNode | undefined {
  //   return this.graph.findNodeById(this.graph.connection.from.nodeId);
  // }

  // findConnectionById(id: string): Connection | undefined {
  //   return this.graph.connections.find((c) => c.id === id);
  // }

  getSourceNode(nodeInterface: string): AbstractCodeNode | undefined {
    let nodeId: string | undefined;
    if (nodeInterface in this.inputs) {
      const connection = this.graph?.connections.find(
        (c) => c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
      );
      if (connection) nodeId = connection.from.nodeId;
    } else if (nodeInterface in this.outputs) {
      const connection = this.graph?.connections.find(
        (c) => c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id,
      );
      if (connection) nodeId = connection.to.nodeId;
    }
    if (!nodeId) return;
    return this.graph?.findNodeById(nodeId) as AbstractCodeNode;
  }

  renderCode(): void {
    this._script = Mustache.render(this.codeTemplate(this), this);
  }

  // public abstract calculate?: CalculateFunction<any, any>;
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

  // codeTemplate?: string;
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode;
