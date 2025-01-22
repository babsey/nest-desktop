// torchConv2d.ts

import { displayInSidebar, IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.nn.Conv2d",
  title: "Convolve in 2D",
  inputs: {
    in_channel: () => new IntegerInterface("in channel", 1).use(displayInSidebar, true).setHidden(true),
    out_channel: () => new IntegerInterface("out channel", 1).use(displayInSidebar, true).setHidden(true),
    kernel_size: () => new IntegerInterface("kernel size", 1).use(displayInSidebar, true).setHidden(true),
    stride: () => new IntegerInterface("stride", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () =>
    "torch.nn.Conv2d({{ inputs.in_channel.value }}, {{ inputs.out_channel.value}}, {{ inputs.kernel_size.value }}, {{ inputs.stride.value }})",
});
