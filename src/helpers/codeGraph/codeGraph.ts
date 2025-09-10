// codeGraph.ts

import { AbstractNode, IBaklavaViewModel, IEditorState, IGraphState } from "baklavajs";
import { nextTick, reactive, UnwrapRef } from "vue";

import { setViewSettings } from "@/plugins/baklava";
import { truncate } from "@/utils/truncate";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseCodeGraph } from "./baseCodeGraph";

interface ICodeGraphState {
  editor: IEditorState | null;
  token: symbol | null;
}

export class CodeGraph extends BaseCodeGraph {
  codeGraphStore = useCodeGraphStore();

  public _code: BaseCode | undefined;
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code?: BaseCode, editorState?: IGraphState) {
    super();
    // this.logger.settings.minLevel = 1;

    setViewSettings(this.viewModel);

    this._code = code;

    this._state = reactive({
      editor: editorState ?? null,
      token: null,
    });
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  get modules(): string[] {
    let categories = Array.from(
      new Set(
        this.nodes
          .filter((node: AbstractCodeNode) => node.module?.length > 0)
          .map((node: AbstractCodeNode) => node.module),
      ),
    );

    this.nodes
      .filter((node: AbstractCodeNode) => node.modules?.length > 0)
      .forEach((node: AbstractCodeNode) => {
        categories = categories.concat(node.modules);
      });

    categories.sort();

    return Array.from(new Set(categories.map((category: string) => this.codeGraphStore.state.modules[category])));
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  override get viewModel(): IBaklavaViewModel {
    return this.codeGraphStore.viewModel as IBaklavaViewModel;
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
    this.logger.trace("init");

    if (this.state.token) this.graph.editor.graphEvents.beforeAddNode.unsubscribe(this.state.token);
    this.state.token = Symbol("token");
    this.graph.editor.graphEvents.beforeAddNode.subscribe(this.state.token, (node: AbstractCodeNode) => {
      if (!node.code && this.code) node.code = this.code;
    });

    this.subscribe();
  }

  /**
   * Load code graph.
   * @param state graph state.
   */
  load(state: IEditorState): string[] {
    this.logger.trace("load:", truncate(state.graph.id));

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
    this.logger.trace("on update:", truncate(this.uuid), truncate(this.graph.id));
    if (this.uuid !== this.graph.id) return;

    if (this.codeGraphStore.state.autosort && this.nodes.length > 0 && this.connections.length > 0) this.sortNodes();

    nextTick(() => {
      this.codeNodes.forEach((node: AbstractCodeNode) => {
        if (node.onGraphUpdate) node.onGraphUpdate();
      });

      try {
        this._state.editor = this.save();
      } catch {
        this.logger.warn("Save editor state failed.");
      }

      this.code?.generate();
    });
  };

  /**
   * Render node codes.
   */
  renderNodeCodes(): void {
    this.logger.trace("render node codes");

    if (this.codeNodes.length === 0) return;
    this.codeNodes.forEach((node) => (node.renderCode ? node.renderCode() : null));
  }

  override subscribe(): void {
    this.logger.trace("subscribe");
    this.codeGraphStore.subscribe(this.onUpdate);
  }

  toJSON(): IEditorState | null {
    return this.state.editor;
  }

  override unsubscribe(): void {
    this.logger.trace("unsubscribe");
    this.codeGraphStore.unsubscribe();
  }
}
