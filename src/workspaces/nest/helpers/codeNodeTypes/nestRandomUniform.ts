// nestRandomUniform.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
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
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.random.uniform(${this.node.inputs.min.value}, ${this.node.inputs.max.value})`;
  },
});
