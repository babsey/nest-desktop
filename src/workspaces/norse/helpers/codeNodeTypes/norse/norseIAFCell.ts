// norseIAFCell.ts

import { NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "norse.torch.IAFCell",
  title: "IAF cell",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "norse.torch.IAFCell()",
  variableName: "model",
});
