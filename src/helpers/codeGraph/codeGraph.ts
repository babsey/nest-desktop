// codeGraph.ts

import { Connection, Editor, Graph, IBaklavaViewModel, IEditorState, NodeInterface, useBaklava } from "baklavajs";
import { reactive, UnwrapRef } from "vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";

interface ICodeGraphState {
  editor: IEditorState | Record<string, any>;
}

export class CodeGraph extends BaseObj {
  public _code: BaseCode;
  public _modelView: IBaklavaViewModel;
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code: BaseCode) {
    super();
    this._code = code;

    const codeGraphStore = useCodeGraphStore();
    this._modelView = useBaklava(codeGraphStore.state.editor as Editor);
    this._state = reactive({
      editor: {},
    });

    this.subscribe();
  }

  get code(): BaseCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this.graph._connections as Connection[];
  }

  set connections(values: Connection[]) {
    this.graph._connections = values as Connection[];
  }

  get graph(): Graph {
    return this._modelView.displayedGraph;
  }

  get modelView(): IBaklavaViewModel {
    return this._modelView;
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph._nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values;
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
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

  init(): void {
    this.clear();
  }

  loadEditorState(): void {
    this._modelView.editor.load(this._state.editor as IEditorState);
  }

  onUpdate = () => {
    this.code.generate();
    this.saveEditorState();
  };

  renderCodes(): void {
    if (this.nodes.length > 0) {
      this.nodes.forEach((node: AbstractCodeNode) => (node.renderCode ? node.renderCode() : null));
    }
  }

  saveEditorState(): void {
    this._state.editor = this._modelView.editor.save();
  }

  subscribe = () => {
    const editor = this.modelView.editor;
    editor.graphEvents.addNode.subscribe(Symbol(), () => this.onUpdate());
    editor.graphEvents.addConnection.subscribe(Symbol(), () => this.onUpdate());
    editor.graphEvents.removeNode.subscribe(Symbol(), () => this.onUpdate());
    editor.graphEvents.removeConnection.subscribe(Symbol(), () => this.onUpdate());
    editor.nodeEvents.update.subscribe(Symbol(), () => this.onUpdate());
  };
}
