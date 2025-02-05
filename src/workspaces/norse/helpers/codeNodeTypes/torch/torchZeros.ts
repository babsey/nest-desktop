// torchZeros.ts

import { IntegerInterface } from "baklavajs";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.zeros",
  title: "zeros",
  inputs: {
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "zeros",
  codeTemplate() {
    if (!this.node) return this.type;
    const sizes = this.node.getConnectedNodesByInterface("size");
    if (sizes.length === 0) return `torch.zeros(${this.node.inputs.size.value})`;
    return `torch.zeros(${this.code?.graph.formatLabels(sizes, false).join(", ")})`;
  },
});
