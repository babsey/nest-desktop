// torchSin.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.sin",
  title: "sinewave",
  inputs: {
    input: () => new NodeInputInterface<ITorchTensor>("input").use(setType, torchTensorType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "sin",
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.sin(${this.node.inputs.input.value})`;
  },
});
