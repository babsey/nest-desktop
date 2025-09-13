// elephant/codeNodeTypes

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import elephantCV from "./elephantCV";
import elephantHomogeneousGammaProcess from "./elephantHomogeneousGammaProcess";
import elephantHomogeneousPoissonProcess from "./elephantHomogeneousPoissonProcess";
import elephantISI from "./elephantISI";
import elephantInstantaneousRate from "./elephantInstantaneousRate";
import elephantMeanFiringRate from "./elephantMeanFiringRate";
import elephantTimeHistogram from "./elephantTimeHistogram";

export const registerElephantNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["elephant"] = "import elephant";
  viewModel.state.modules["elephant.spike_train_generation"] = "import elephant";
  viewModel.state.modules["elephant.statistics"] = "import elephant";
  viewModel.state.modules["quantities"] = "import quantities as pq";

  const editor = viewModel.editor;
  editor.registerNodeType(elephantHomogeneousGammaProcess, { category: "elephant.spike_train_generation" });
  editor.registerNodeType(elephantHomogeneousPoissonProcess, { category: "elephant.spike_train_generation" });
  editor.registerNodeType(elephantCV, { category: "elephant.statistics" });
  editor.registerNodeType(elephantISI, { category: "elephant.statistics" });
  editor.registerNodeType(elephantInstantaneousRate, { category: "elephant.statistics" });
  editor.registerNodeType(elephantMeanFiringRate, { category: "elephant.statistics" });
  editor.registerNodeType(elephantTimeHistogram, { category: "elephant.statistics" });
};
