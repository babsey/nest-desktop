// torchMaxPool2d.ts

import { displayInSidebar, IntegerInterface, NodeInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.MaxPool2d",
  title: "max pool 2D",
  inputs: {
    kernel_size: () => new IntegerInterface("kernel size", 1).use(setType, numberType).use(displayInSidebar, true),
    stride: () => new IntegerInterface("stride", 1).use(setType, numberType).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: (node) =>
    node
      ? `torch.nn.MaxPool2d(${node.inputs.kernel_size.value}, ${node.inputs.stride.value})`
      : "torch.nn.MaxPool2d({{ inputs.kernel_size.value }}, {{ inputs.stride.value }})",
});
