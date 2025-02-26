// norseLIFParameters.ts

import { NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "norse.torch.IAFParameters",
  title: "IAF Parameters",
  inputs: {
    v_th: () => new NumberInterface("v_th", 1),
    v_reset: () => new NumberInterface("v_reset", 0),
    alpha: () => new NumberInterface("alpha", 100),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "p",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];
    if (this.node.inputs.v_th.value !== 1) args.push(`v_th=torch.tensor(${this.node.inputs.v_th.value})`);
    if (this.node.inputs.v_reset.value !== 0) args.push(`v_reset=torch.tensor(${this.node.inputs.v_reset.value})`);
    if (this.node.inputs.alpha.value !== 100) args.push(`alpha=torch.tensor(${this.node.inputs.alpha.value})`);
    return args.length > 0 ? `norse.torch.IAFParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.IAFParameters()";
  },
});
