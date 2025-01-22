// codeGraphStore.ts

import { Editor } from "baklavajs";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useCodeGraphStore = defineStore("code-graph", () => {
  const state = reactive<{ editor: Editor }>({
    editor: new Editor(),
  });

  const mount = (): void => {};

  const unmount = (): void => {};

  return { mount, state, unmount };
});
