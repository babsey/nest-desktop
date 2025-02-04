// norseLinear.ts

import { IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.Linear",
  title: "linear",
  inputs: {
    in_feature: () => new IntegerInterface("in feature", 1).use(setType, numberType),
    out_feature: () => new IntegerInterface("out feature", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.nn.Linear(${this.node.inputs.in_feature.value}, ${this.node.inputs.out_feature.value})`;
  },
});
