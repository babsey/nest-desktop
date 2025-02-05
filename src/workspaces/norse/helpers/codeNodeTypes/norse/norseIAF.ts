// norseIAFCell.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "norse.torch.IAF",
  title: "IAF",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "model",
  codeTemplate: () => "norse.torch.IAF()",
});
