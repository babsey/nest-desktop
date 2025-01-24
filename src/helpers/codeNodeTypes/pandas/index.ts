// pandas/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import pandasDataFrame from "./pandasDataFrame";

export const registerPandasNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["pandas"] = "import pandas as pd";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(pandasDataFrame, { category: "pandas" });
};
