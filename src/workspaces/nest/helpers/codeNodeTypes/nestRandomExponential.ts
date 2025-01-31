// nestRandomExponential.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.exponential",
  title: "random exponential",
  inputs: {
    beta: () => new IntegerInterface("beta", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "randexp",
  codeTemplate: () => "nest.random.exponential({{ inputs.beta.value }})",
});
