// elephant/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import elephantHomogeneousGammaProcess from "./elephantHomogeneousGammaProcess";
import elephantHomogeneousPoissonProcess from "./elephantHomogeneousPoissonProcess";
import elephantICV from "./elephantICV";
import elephantISI from "./elephantISI";
import elephantInstantaneousRate from "./elephantInstantaneousRate";
import elephantMeanFiringRate from "./elephantMeanFiringRate";
import elephantTimeHistogram from "./elephantTimeHistogram";

export const registerElephantNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["elephant"] = "import elephant";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(elephantHomogeneousGammaProcess, { category: "elephant" });
  editor.registerNodeType(elephantHomogeneousPoissonProcess, { category: "elephant" });
  editor.registerNodeType(elephantICV, { category: "elephant" });
  editor.registerNodeType(elephantISI, { category: "elephant" });
  editor.registerNodeType(elephantInstantaneousRate, { category: "elephant" });
  editor.registerNodeType(elephantMeanFiringRate, { category: "elephant" });
  editor.registerNodeType(elephantTimeHistogram, { category: "elephant" });
};
