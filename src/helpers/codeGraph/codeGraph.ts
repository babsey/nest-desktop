// codeGraph.ts

import { Connection, Editor, Graph, IGraphState, NodeInterface } from "baklavajs";
import { reactive, UnwrapRef } from "vue";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

interface ICodeGraphState {
  graph: IGraphState;
}

export class CodeGraph extends BaseObj {
  public _code: BaseCode;
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code: BaseCode, graphState: IGraphState = new Graph(new Editor()).save()) {
    super();
    this._code = code;

    this._state = reactive({
      graph: graphState,
    });
  }

  get code(): BaseCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  set connections(values: Connection[]) {
    this.graph._connections = values as Connection[];
  }

  get graph(): Graph {
    const codeGraphStore = useCodeGraphStore();
    return codeGraphStore.viewModel.editor.graph as Graph;
  }

  get modules(): string[] {
    const codeGraphStore = useCodeGraphStore();
    const categories = Array.from(
      new Set(
        this.nodes
          .filter((node: AbstractCodeNode) => node.type.includes("."))
          .map((node: AbstractCodeNode) => node.type.split(".")[0]),
      ),
    );
    categories.sort();
    return categories.map((category: string) => codeGraphStore.state.modules[category]);
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values;
  }

  get segregatedNodes(): AbstractCodeNode[] {
    return this.graph.nodes.filter((node: AbstractCodeNode) => !node.state.integrated) as AbstractCodeNode[];
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.graph.nodes.filter((node: AbstractCodeNode) => !node.state.hidden) as AbstractCodeNode[];
  }

  addConnection(from: NodeInterface, to: NodeInterface): void {
    this.graph.addConnection(from, to);
  }

  addNode(node: AbstractCodeNode): void {
    this.graph.addNode(node);
  }

  addNodeWithCoordinates(nodeType: new () => AbstractCodeNode, x: number, y: number) {
    const node = this.createNode(nodeType);
    this.addNode(node);
    if (node.position) {
      node.position.x = x;
      node.position.y = y;
    }
    return node;
  }

  createNode(nodeType: new () => AbstractCodeNode) {
    const node = new nodeType();
    node.code = this.code;
    return node;
  }

  clear(): void {
    this.nodes = [];
    this.connections = [];
  }

  init(): void {
    // this.clear();
  }

  load(): void {
    if (this.graph.id === this.state.graph.id) return;
    this.unsubscribe();
    this.graph.load(this.state.graph);
    this.subscribe();
  }

  onUpdate = () => {
    this.code.generate();
    this.save();
  };

  renderCodes(): void {
    if (this.nodes.length === 0) return;
    this.nodes.forEach((node: AbstractCodeNode) => (node.renderCode ? node.renderCode() : null));
  }

  save(): void {
    this.state.graph = this.graph.save();
  }

  subscribe(): void {
    const codeGraphStore = useCodeGraphStore();
    codeGraphStore.subscribe(this.onUpdate);
  }

  unsubscribe(): void {
    const codeGraphStore = useCodeGraphStore();
    codeGraphStore.unsubscribe();
  }
}
