// pynn/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import pynnRun from "./pynnRun";

export const registerPyNNNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["pynn"] = "import pynn";

  const editor = codeGraphStore.viewModel.editor;

  editor.registerNodeType(pynnRun, { category: "pynn" });
};
