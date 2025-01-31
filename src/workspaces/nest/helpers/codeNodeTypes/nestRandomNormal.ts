// nestRandomNormal.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.normal",
  title: "random normal",
  inputs: {
    mean: () => new IntegerInterface("mean", 0),
    std: () => new IntegerInterface("std", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "randnorm",
  codeTemplate: () => "nest.random.normal({{ inputs.mean.value }}, {{ inputs.std.value }})",
});
