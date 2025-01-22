// numpyCorrelation.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.correlate",
  title: "Correlation",
  inputs: {
    array: () => new NodeInterface("array", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "np.correlate()",
});
