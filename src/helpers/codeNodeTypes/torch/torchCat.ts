// torchCat.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.cat",
  title: "cat",
  inputs: {
    tensors: () => new NodeInputInterface<ITorchTensor>("tensors").use(setType, torchTensorType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const tensors = this.node.getConnectedOutputInterfaceByInterface("tensors");
    if (tensors) args.push(`${formatInterfaceLabel(tensors)}`);

    return `torch.cat(${args.join(", ")})`;
  },
});
