// torchZeros.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.zeros",
  title: "zeros",
  inputs: {
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "zeros",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const size = this.node.getConnectedNodesByInterface("size");
    if (size.length > 0) args.push(`${formatLabels(size, false).join(", ")}`);
    else args.push(`${this.node.inputs.size.value}`);

    return `torch.zeros(${args.join(", ")})`;
  },
});
