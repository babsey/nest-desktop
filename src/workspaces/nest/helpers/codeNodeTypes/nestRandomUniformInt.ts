// nestRandomUniform.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.uniform_int",
  title: "random uniform int",
  inputs: {
    max: () => new IntegerInterface("max", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "randuniint",
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.random.uniform_int(${this.node.inputs.max.value})`;
  },
});
