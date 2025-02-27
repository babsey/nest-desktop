// torchManualSeed.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.manual_seed",
  title: "manual seed",
  inputs: {
    seed: () => new NodeInputInterface("seed"),
  },
  onCreate() {
    this.state.position = "top";
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.manual_seed(${this.node.inputs.seed.value})`;
  },
});
