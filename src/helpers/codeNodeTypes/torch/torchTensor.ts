// torchTensor.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, formatLabels } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.tensor",
  title: "tensor",
  inputs: {
    data: () => new IntegerInterface("data", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "tensor",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const data = this.node.getConnectedNodesByInterface("data");
    if (data.length > 0) args.push(`${formatLabels(data, false).join(", ")}`);
    else args.push(`${this.node.inputs.data.value}`);

    return `torch.tensor(${args.join(", ")})`;
  },
});
