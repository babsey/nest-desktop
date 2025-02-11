// codeGraphStore.ts

import { Editor, IEditorState, useBaklava } from "baklavajs";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useCodeGraphStore = defineStore("code-graph", () => {
  const state = reactive<{ editor: IEditorState; modules: Record<string, string>; token: symbol }>({
    editor: new Editor().save(),
    token: Symbol("token"),
    modules: {},
  });

  const viewModel = useBaklava();

  const subscribe = (call: () => void): void => {
    state.token = Symbol("token");
    viewModel.editor.graphEvents.addNode.subscribe(state.token, () => call());
    viewModel.editor.graphEvents.addConnection.subscribe(state.token, () => call());
    viewModel.editor.graphEvents.removeNode.subscribe(state.token, () => call());
    viewModel.editor.graphEvents.removeConnection.subscribe(state.token, () => call());
    viewModel.editor.nodeEvents.update.subscribe(state.token, () => call());
  };

  const unsubscribe = (): void => {
    viewModel.editor.graphEvents.addNode.unsubscribe(state.token);
    viewModel.editor.graphEvents.removeNode.unsubscribe(state.token);
    viewModel.editor.graphEvents.addConnection.unsubscribe(state.token);
    viewModel.editor.graphEvents.removeConnection.unsubscribe(state.token);
    viewModel.editor.nodeEvents.update.unsubscribe(state.token);
  };

  return { state, subscribe, unsubscribe, viewModel };
});
