// nestRandomExponential.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
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
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.random.exponential(${this.node.inputs.beta.value})`;
  },
});
