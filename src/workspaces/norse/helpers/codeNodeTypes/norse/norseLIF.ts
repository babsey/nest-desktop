// norseIAFCell.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "norse.torch.LIF",
  title: "LIF",
  inputs: {
    p: () => new NodeInputInterface("p"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "model",
  codeTemplate() {
    if (!this.node) return this.type;
    const nodes = this.node.getConnectedNodesByInterface("p");
    return `norse.torch.LIF(${this.code?.graph.formatLabels(nodes).join(", ")})`;
  },
});
