// apply.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "apply",
  title: "apply",
  inputs: {
    call: () => new NodeInputInterface("call"),
    inputs: () => new NodeInputInterface("inputs"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const calls = this.node.getConnectedNodesByInterface("call");
    if (calls.length == 0) return this.type;
    const inputs = this.node.getConnectedNodesByInterface("inputs");
    return `${calls[0].label}(${this.code?.graph.formatLabels(inputs).join(", ")})`;
  },
});
