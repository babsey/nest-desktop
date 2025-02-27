// norseLI.ts

import { CheckboxInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "norse.torch.LI",
  title: "LI",
  inputs: {
    p: () => new NodeInputInterface("p"),
    record_states: () => new CheckboxInterface("record_states", false),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "model",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const nodes = this.node.getConnectedNodesByInterface("p");
    if (nodes.length > 0) args.push(`p=${this.code?.graph.formatLabels(nodes).join(", ")}`);
    if (this.node.inputs.record_states.value) args.push(`record_states=True`);

    return `norse.torch.LI(${args.join(", ")})`;
  },
});
