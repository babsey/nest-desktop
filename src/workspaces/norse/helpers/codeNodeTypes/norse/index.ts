// codeNodeTypes/norse

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import norseIAF from "./norseIAF";
import norseIAFCell from "./norseIAFCell";
import norseModelApply from "./norseModelApply";
import norseSequentialState from "./norseSequentialState";

export const registerNorseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["norse"] = "import norse";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(norseIAF, { category: "norse.torch" });
  editor.registerNodeType(norseIAFCell, { category: "norse.torch" });
  editor.registerNodeType(norseModelApply, { category: "norse" });
  editor.registerNodeType(norseSequentialState, { category: "norse.torch" });
};
