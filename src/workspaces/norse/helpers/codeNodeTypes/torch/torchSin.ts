// torchSin.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.sin",
  title: "sinewave",
  inputs: {
    input: () => new NodeInputInterface("input"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "sin",
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.sin(${this.node.inputs.input.value})`;
  },
});
