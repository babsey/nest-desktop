// norseLinear.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.nn.Linear",
  title: "Linear",
  inputs: {
    in_feature: () => new IntegerInterface("in feature", 1),
    out_feature: () => new IntegerInterface("out feature", 1),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "torch.nn.Linear({{ inputs.in_feature.value }}, {{ inputs.out_feature.value}})",
});
