// torchMaxPool2d.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.MaxPool2d",
  title: "max pool (2D)",
  inputs: {
    kernel_size: () => new IntegerInterface("kernel size", 1).use(setType, numberType).use(displayInSidebar, true),
    stride: () => new IntegerInterface("stride", 1).use(setType, numberType).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "maxPool",
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.nn.MaxPool2d(${this.node.inputs.kernel_size.value}, ${this.node.inputs.stride.value})`;
  },
});
