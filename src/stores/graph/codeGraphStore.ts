// codeGraphStore.ts

import { Editor, IEditorState } from "baklavajs";
import { defineStore } from "pinia";
import { reactive } from "vue";

import { useCodeGraph } from "@/codeGraph";

export const useCodeGraphStore = defineStore("code-graph", () => {
  const state = reactive<{
    editor: IEditorState;
    token: symbol | null;
  }>({
    editor: new Editor().save(),
    token: null,
  });

  const viewModel = useCodeGraph();
  const editor: Editor = viewModel.editor;

  const subscribe = (call: () => void): void => {
    if (state.token) unsubscribe();

    state.token = Symbol("token");
    editor.graphEvents.addNode.subscribe(state.token, () => call());
    editor.graphEvents.addConnection.subscribe(state.token, () => call());
    editor.graphEvents.removeNode.subscribe(state.token, () => call());
    editor.graphEvents.removeConnection.subscribe(state.token, () => call());

    // TODO: it renders code of all nodes, find better solution to render code of active node only.
    editor.nodeEvents.update.subscribe(state.token, () => call());
  };

  const unsubscribe = (): void => {
    if (!state.token) return;

    editor.graphEvents.addNode.unsubscribe(state.token);
    editor.graphEvents.removeNode.unsubscribe(state.token);
    editor.graphEvents.addConnection.unsubscribe(state.token);
    editor.graphEvents.removeConnection.unsubscribe(state.token);
    editor.nodeEvents.update.unsubscribe(state.token);

    state.token = null;
  };

  return { editor, state, subscribe, unsubscribe, viewModel };
});
