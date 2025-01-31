// nestRandomUniform.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.uniform",
  title: "random uniform",
  inputs: {
    min: () => new IntegerInterface("min", 0),
    max: () => new IntegerInterface("max", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "randuni",
  codeTemplate: () => "nest.random.uniform({{ inputs.min.value }}, {{ inputs.max.value }})",
});
