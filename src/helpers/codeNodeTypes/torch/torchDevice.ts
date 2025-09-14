// torchDevice.ts

import { TextInputInterface } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, formatLabels } from "@/codeGraph";

export default defineCodeNode({
  type: "torch.device",
  title: "device",
  inputs: {
    type: () => new TextInputInterface("type", "cpu"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "device",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const types = this.node.getConnectedNodesByInterface("type");
    if (types.length > 0) args.push(`${formatLabels(types, false)}`);
    else args.push(`"${this.node.inputs.type.value}"`);

    return `torch.device(${args.join(", ")})`;
  },
});
