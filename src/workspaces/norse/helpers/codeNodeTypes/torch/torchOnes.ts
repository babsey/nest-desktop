// torchOnes.ts

import { IntegerInterface } from "baklavajs";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.ones",
  title: "ones",
  inputs: {
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "ones",
  codeTemplate() {
    if (!this.node) return this.type;
    const sizes = this.node.getConnectedNodesByInterface("size");
    if (sizes.length === 0) return `torch.ones(${this.node.inputs.size.value})`;
    return `torch.ones(${this.code?.graph.formatLabels(sizes, false).join(", ")})`;
  },
});
