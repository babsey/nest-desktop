// torchMSELoss.ts

import { NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "torch.nn.MSELoss",
  title: "MSE Loss",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "loss_fn",
  codeTemplate() {
    if (!this.node) return this.type;
    return `nn.MSELoss()`;
  },
});
