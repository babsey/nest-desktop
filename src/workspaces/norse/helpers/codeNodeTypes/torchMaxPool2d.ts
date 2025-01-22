// torchMaxPool2d.ts

import { displayInSidebar, IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.nn.MaxPool2d",
  title: "Max Pool 2D",
  inputs: {
    kernel_size: () => new IntegerInterface("kernel size", 1).use(displayInSidebar, true),
    stride: () => new IntegerInterface("stride", 1).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "torch.nn.MaxPool2d({{ inputs.kernel_size.value }}, {{ inputs.stride.value }})",
});
