// numpyRandomNormal.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.random.normal",
  title: "Random normal distribution",
  inputs: {
    loc: () => new IntegerInterface("loc", 0),
    scale: () => new IntegerInterface("scale", 1),
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "np.random.normal()",
});
