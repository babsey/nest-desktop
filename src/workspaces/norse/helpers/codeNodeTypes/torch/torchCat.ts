// torchCat.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.cat",
  title: "cat",
  inputs: {
    tensors: () => new NodeInputInterface("tensors"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.cat(${this.node.inputs.tensors.value})`;
  },
});
