// codeNodeTypes/pandas

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import pandasDataFrame from "./pandasDataFrame";
import { addPandasTypes } from "./interfaceTypes";
import pandasConcat from "./pandasConcat";

export const registerPandasNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["pandas"] = "import pandas as pd";
  addPandasTypes(viewModel);

  const editor = viewModel.editor;
  editor.registerNodeType(pandasConcat, { category: "pandas" });
  editor.registerNodeType(pandasDataFrame, { category: "pandas" });
};
