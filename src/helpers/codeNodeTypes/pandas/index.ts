// codeNodeTypes/pandas

import { IBaklavaViewModel } from "baklavajs";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import pandasDataFrame from "./pandasDataFrame";
import { addPandasTypes } from "./interfaceTypes";

export const registerPandasNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["pandas"] = "import pandas as pd";
  addPandasTypes(codeGraphStore.viewModel as IBaklavaViewModel);

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(pandasDataFrame, { category: "pandas" });
};
