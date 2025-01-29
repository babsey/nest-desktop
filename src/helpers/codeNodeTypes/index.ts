// codeNodeTypes

import { registerBaseNodeTypes } from "./base";
import { registerElephantNodeTypes } from "@/workspaces/elephant/helpers/codeNodeTypes/elephant";
import { registerNESTNodeTypes } from "@/workspaces/nest/helpers/codeNodeTypes";
import { registerNeoNodeTypes } from "@/workspaces/elephant/helpers/codeNodeTypes/neo";
import { registerNorseNodeTypes } from "@/workspaces/norse/helpers/codeNodeTypes/norse";
import { registerNumpyNodeTypes } from "./numpy";
import { registerPandasNodeTypes } from "./pandas";
import { registerPlotlyNodeTypes } from "./plotly";
import { registerPyNNNodeTypes } from "@/workspaces/pynn/helpers/codeNodeTypes/pynn";
import { registerTorchNodeTypes } from "@/workspaces/norse/helpers/codeNodeTypes/torch";

export const registerCodeNodeTypes = (nodeTypes: string[]) => {
  if (nodeTypes.includes("base")) registerBaseNodeTypes();
  if (nodeTypes.includes("elephant")) registerElephantNodeTypes();
  if (nodeTypes.includes("neo")) registerNeoNodeTypes();
  if (nodeTypes.includes("nest")) registerNESTNodeTypes();
  if (nodeTypes.includes("norse")) registerNorseNodeTypes();
  if (nodeTypes.includes("numpy")) registerNumpyNodeTypes();
  if (nodeTypes.includes("pandas")) registerPandasNodeTypes();
  if (nodeTypes.includes("plotly")) registerPlotlyNodeTypes();
  if (nodeTypes.includes("pynn")) registerPyNNNodeTypes();
  if (nodeTypes.includes("torch")) registerTorchNodeTypes();
};
