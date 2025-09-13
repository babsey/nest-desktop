// codeNodeTypes

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";
import { registerDefaultNodeTypes, registerPythonNodeTypes } from "@/codeGraph/codeNodeTypes";

import { registerHumamNodeTypes } from "./humam";
import { registerNeoNodeTypes } from "./neo";
import { registerNumpyNodeTypes } from "./numpy";
import { registerPandasNodeTypes } from "./pandas";
import { registerPlotlyNodeTypes } from "./plotly";
import { registerTorchNodeTypes } from "./torch";

import { registerBrainScales2NodeTypes } from "@/workspaces/pynn/helpers/codeNodeTypes/brainscales2";
import { registerElephantNodeTypes } from "@/workspaces/elephant/helpers/codeNodeTypes/elephant";
import { registerNESTNodeTypes } from "@/workspaces/nest/helpers/codeNodeTypes/nest";
import { registerNorseNodeTypes } from "@/workspaces/norse/helpers/codeNodeTypes/norse";
import { registerPyNNNodeTypes } from "@/workspaces/pynn/helpers/codeNodeTypes/pynn";

export const registerCodeNodeTypes = (viewModel: ICodeGraphViewModel, nodeTypes: string[]) => {
  registerDefaultNodeTypes(viewModel);

  if (nodeTypes.includes("python")) registerPythonNodeTypes(viewModel);
  if (nodeTypes.includes("brainscales2")) registerBrainScales2NodeTypes(viewModel);
  if (nodeTypes.includes("elephant")) registerElephantNodeTypes(viewModel);
  if (nodeTypes.includes("neo")) registerNeoNodeTypes(viewModel);
  if (nodeTypes.includes("nest")) registerNESTNodeTypes(viewModel);
  if (nodeTypes.includes("norse")) registerNorseNodeTypes(viewModel);
  if (nodeTypes.includes("numpy")) registerNumpyNodeTypes(viewModel);
  if (nodeTypes.includes("pandas")) registerPandasNodeTypes(viewModel);
  if (nodeTypes.includes("humam")) registerHumamNodeTypes(viewModel);
  if (nodeTypes.includes("plotly")) registerPlotlyNodeTypes(viewModel);
  if (nodeTypes.includes("pynn")) registerPyNNNodeTypes(viewModel);
  if (nodeTypes.includes("torch")) registerTorchNodeTypes(viewModel);
};
