// humam/codeNodeTypes

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import humamAnalysis from "./humamAnalysis";
import humamNetwork from "./humamNetwork";
import humamNeuronNumbers from "./humamNeuronNumbers";
import humamSimulation from "./humamSimulation";
import humamSynapseNumbers from "./humamSynapseNumbers";

export const registerHumamNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["humam"] = "import humam";

  const editor = viewModel.editor;
  editor.registerNodeType(humamAnalysis, { category: "humam" });
  editor.registerNodeType(humamNetwork, { category: "humam" });
  editor.registerNodeType(humamNeuronNumbers, { category: "humam" });
  editor.registerNodeType(humamSimulation, { category: "humam" });
  editor.registerNodeType(humamSynapseNumbers, { category: "humam" });
};
