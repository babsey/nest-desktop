// norse/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import norseIAFCell from "./norseIAFCell";
import norseSequentialState from "./norseSequentialState";

export const registerNorseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["norse"] = "import norse";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(norseIAFCell, { category: "norse.torch" });
  editor.registerNodeType(norseSequentialState, { category: "norse.torch" });
};
