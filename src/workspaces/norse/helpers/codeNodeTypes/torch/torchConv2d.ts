// torchConv2d.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.Conv2d",
  title: "convolve (2D)",
  inputs: {
    in_channel: () =>
      new IntegerInterface("in channel", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    out_channel: () =>
      new IntegerInterface("out channel", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    kernel_size: () =>
      new IntegerInterface("kernel size", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    stride: () =>
      new IntegerInterface("stride", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "conv",
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.nn.Conv2d(${this.node.inputs.in_channel.value}, ${this.node.inputs.out_channel.value}, ${this.node.inputs.kernel_size.value}, ${this.node.inputs.stride.value})`;
  },
});
