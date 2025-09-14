// apply.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatLabels } from "@/codeGraph";

export default defineCodeNode({
  type: "apply",
  title: "apply",
  inputs: {
    call: () => new TextInputInterface("call", ""),
    args: () => new NodeInputInterface("args"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const calls = this.node.getConnectedNodesByInterface("call");
    const call = calls.length == 0 ? this.node.inputs.call.value : calls[0].label;

    const args = this.node.getConnectedNodesByInterface("args");

    return `${call}(${formatLabels(args).join(", ")})`;
  },
});
