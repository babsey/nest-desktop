// codeGraph.ts

import { type AbstractNode, IEditorState } from "baklavajs";
import { nextTick, reactive, UnwrapRef } from "vue";

import { type AbstractCodeNode, CodeGraph as BaseCodeGraph } from "@/codeGraph";
import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { BaseCode } from "./code";

interface ICodeGraphState {
  editor: IEditorState | null;
  token: symbol | null;
}

export class CodeGraph extends BaseCodeGraph<ICodeGraphState> {
  public codeGraphStore = useCodeGraphStore();
  public _code: BaseCode | undefined;

  constructor(code?: BaseCode, editorState?: IEditorState) {
    super();

    this._code = code;
    if (editorState) this.state.editor = editorState as IEditorState;
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  override get viewModel(): ICodeGraphViewModel {
    return this.codeGraphStore.viewModel as ICodeGraphViewModel;
  }

  /**
   * Add code node to graph.
   * @param node code node
   */
  override addNode(node: AbstractCodeNode): AbstractCodeNode | undefined {
    if (!node.code && this.code) node.code = this.code;
    return this.graph.addNode(node as AbstractNode) as AbstractCodeNode;
  }

  /**
   * Initialize code graph.
   */
  init(): void {
    if (this.state.token) this.graph.editor.graphEvents.beforeAddNode.unsubscribe(this.state.token);
    this.state.token = Symbol("token");
    this.graph.editor.graphEvents.beforeAddNode.subscribe(this.state.token, (node: AbstractCodeNode) => {
      if (!node.code && this.code) node.code = this.code;
    });

    this.subscribe();
  }

  /**
   * Initialize state.
   */
  override initState(): void {
    this.state = reactive({
      autosort: false,
      editor: null,
      script: "",
      token: null,
    }) as UnwrapRef<ICodeGraphState>;
  }

  /**
   * Load code graph.
   * @param state graph state
   */
  load(state: IEditorState): string[] {
    if (!state) return [];
    this.unsubscribe();

    state.graph.id = this.uuid;
    const warnings: string[] = this.codeGraphStore.editor.load(state);

    this.onUpdate();
    this.subscribe();
    return warnings;
  }

  /**
   * Triggers on code graph update.
   */
  override onUpdate = () => {
    if (this.uuid !== this.graph.id) return;

    if (this.codeGraphStore.state.autosort && this.nodes.length > 0 && this.connections.length > 0) this.sortNodes();

    nextTick(() => {
      this.codeNodes.forEach((node: AbstractCodeNode) => {
        if (node.onGraphUpdate) node.onGraphUpdate();
      });

      try {
        this.state.editor = this.save();
      } catch {
        console.warn("Failed to save editor state.");
      }

      this.code?.generate();
    });
  };

  override subscribe(): void {
    this.codeGraphStore.subscribe(this.onUpdate);
  }

  toJSON(): IEditorState | null {
    return this.save();
  }

  override unsubscribe(): void {
    this.codeGraphStore.unsubscribe();
  }
}
