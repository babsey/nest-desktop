// codeNodeTypes/norse

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import norseIAF from "./norseIAF";
import norseIAFCell from "./norseIAFCell";
import norseLIF from "./norseLIF";
import norseLIFParameters from "./norseLIFParameters";
import norseModelApply from "./norseModelApply";
import norseSequentialState from "./norseSequentialState";
import norseDataResponse from "./norseDataResponse";

export const registerNorseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["norse"] = "import norse";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(norseDataResponse, { category: "norse" });
  editor.registerNodeType(norseIAF, { category: "norse.torch" });
  editor.registerNodeType(norseIAFCell, { category: "norse.torch" });
  editor.registerNodeType(norseLIF, { category: "norse.torch" });
  editor.registerNodeType(norseLIFParameters, { category: "norse.torch" });
  editor.registerNodeType(norseModelApply, { category: "norse" });
  editor.registerNodeType(norseSequentialState, { category: "norse.torch" });
};
