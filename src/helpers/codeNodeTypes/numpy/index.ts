// numpy/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import numpyConvolve from "./numpyConvolve";
import numpyCorrelate from "./numpyCorrelate";
import numpyRandomNormal from "./numpyRandomNormal";
import numpyRandomRandint from "./numpyRandomRandint";
import numpyRandomSeed from "./numpyRandomSeed";

export const registerNumpyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["numpy"] = "import numpy as np";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(numpyConvolve, { category: "numpy" });
  editor.registerNodeType(numpyCorrelate, { category: "numpy" });
  editor.registerNodeType(numpyRandomNormal, { category: "numpy" });
  editor.registerNodeType(numpyRandomRandint, { category: "numpy" });
  editor.registerNodeType(numpyRandomSeed, { category: "numpy" });
};
