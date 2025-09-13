// codeNodeTypes/pynn/nest

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import pynnNESTEnd from "./pynnNESTEnd";
import pynnNESTPopulation from "./pynnNESTPopulation";
import pynnNESTRun from "./pynnNESTRun";
import pynnNESTSetup from "./pynnNESTSetup";
import pynnNESTRandomDistribution from "./pynnNESTRandomDistribution";
import pynnNESTProjection from "./pynnNESTProjection";
import pynnNESTIFCurrAlpha from "./pynnNESTIFCurrAlpha";

export const registerPyNNNESTNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["pyNN.nest"] = "import pyNN.nest";

  const editor = viewModel.editor;
  editor.registerNodeType(pynnNESTEnd, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTIFCurrAlpha, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTPopulation, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTProjection, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTRun, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTRandomDistribution, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTSetup, { category: "pyNN.nest" });
};
