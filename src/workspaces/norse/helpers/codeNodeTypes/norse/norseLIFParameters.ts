// norseIAFCell.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NumberInterface } from "baklavajs";

export default defineCodeNode({
  type: "norse.torch.LIFParameters",
  title: "LIF Parameters",
  inputs: {
    tau_syn_inv: () => new NumberInterface("tau_syn_inv", 200),
    tau_mem_inv: () => new NumberInterface("tau_mem_inv", 100),
    v_leak: () => new NumberInterface("v_leak", 0),
    v_th: () => new NumberInterface("v_th", 1),
    v_reset: () => new NumberInterface("v_reset", 0),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "p",
  codeTemplate: () => "norse.torch.LIFParameters()",
});
