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

  get nodesSegregated(): AbstractCodeNode[] {
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
    const node = new nodeType();
    this.addNode(node);
    if (node.position) {
      node.position.x = x;
      node.position.y = y;
    }
    return node;
  }

  clear(): void {
    this.nodes = [];
    this.connections = [];
  }

  formatLabels(nodes: AbstractCodeNode[], sorted: boolean = true): string[] {
    const labels = nodes.map((node: AbstractCodeNode) => (node.state.integrated ? node.codeTemplate : node.label));
    if (sorted) labels.sort();
    return labels;
  }

  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.nodes.filter((node: AbstractCodeNode) => node.variableName === variableName) as AbstractCodeNode[];
  }

  init(): void {
    this.onUpdate();
  }

  load(): void {
    if (this.graph.id === this.state.graph.id) return;
    this.unsubscribe();
    this.graph.load(this.state.graph);
    this.subscribe();
  }

  onUpdate = () => {
    this.sortNodes();
    this.graph.nodes.forEach((node) => (node.code = this.code));
    this.graph.nodes;
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

  sortNodes(): void {
    const nodes: Record<string, AbstractCodeNode[]> = { top: [], auto: [], bottom: [] };
    this.graph.nodes.forEach((node) => nodes[node.state.position].push(node));
    this.graph._nodes = [...nodes.top, ...nodes.auto, ...nodes.bottom];
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
