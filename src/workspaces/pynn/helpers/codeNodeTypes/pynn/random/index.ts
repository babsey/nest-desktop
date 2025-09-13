// codeNodeTypes/pynn

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import pynnRandomDistribution from "./pynnRandomDistribution";

export const registerPyNNRandmNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["pyNN.random"] = "import pyNN.random";

  const editor = viewModel.editor;
  editor.registerNodeType(pynnRandomDistribution, { category: "pynn.random" });
};
