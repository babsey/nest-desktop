// pynn/codeNodeTypes

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import { registerPyNNNESTNodeTypes } from "./nest";
import { registerPyNNRandmNodeTypes } from "./random";

export const registerPyNNNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["pynn"] = "import pynn";

  registerPyNNNESTNodeTypes();
  registerPyNNRandmNodeTypes();
};
