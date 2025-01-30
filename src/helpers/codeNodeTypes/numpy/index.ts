// codeNodeTypes/numpy

import { IBaklavaViewModel } from "baklavajs";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import numpyArange from "./numpyArange";
import numpyConcatenate from "./numpyConcatenate";
import numpyConvolve from "./numpyConvolve";
import numpyCorrCoef from "./numpyCorrCoef";
import numpyCorrelate from "./numpyCorrelate";
import numpyFull from "./numpyFull";
import numpyHistogram from "./numpyHistogram";
import numpyRandomNormal from "./numpyRandomNormal";
import numpyRandomRandint from "./numpyRandomRandint";
import numpyRandomSeed from "./numpyRandomSeed";
import numpyRandomUniform from "./numpyRandomUniform";
import { addNumpyTypes } from "./interfaceTypes";

export const registerNumpyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["numpy"] = "import numpy as np";
  addNumpyTypes(codeGraphStore.viewModel as IBaklavaViewModel);

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(numpyArange, { category: "numpy" });
  editor.registerNodeType(numpyConcatenate, { category: "numpy" });
  editor.registerNodeType(numpyConvolve, { category: "numpy" });
  editor.registerNodeType(numpyCorrCoef, { category: "numpy" });
  editor.registerNodeType(numpyCorrelate, { category: "numpy" });
  editor.registerNodeType(numpyFull, { category: "numpy" });
  editor.registerNodeType(numpyHistogram, { category: "numpy" });
  editor.registerNodeType(numpyRandomNormal, { category: "numpy" });
  editor.registerNodeType(numpyRandomRandint, { category: "numpy" });
  editor.registerNodeType(numpyRandomSeed, { category: "numpy" });
  editor.registerNodeType(numpyRandomUniform, { category: "numpy" });
};
