// numpyRandomUniform.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.random.uniform",
  title: "Random uniform distribution",
  inputs: {
    low: () => new IntegerInterface("low", 0),
    high: () => new IntegerInterface("high", 1),
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "np.random.uniform()",
});
