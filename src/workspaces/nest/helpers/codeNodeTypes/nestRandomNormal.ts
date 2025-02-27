// nestRandomNormal.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
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
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.random.normal(${this.node.inputs.mean.value}, ${this.node.inputs.std.value})`;
  },
});
