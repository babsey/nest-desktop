// torchRand.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, numberType } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.rand",
  title: "rand",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const size = this.node.getConnectedOutputInterfacesByInterface("size");
    if (size.length > 0) args.push(`${formatInterfaceLabels(size, false).join(", ")}`);
    else args.push(`${this.node.inputs.size.value}`);

    return `torch.rand(${args.join(", ")})`;
  },
});
