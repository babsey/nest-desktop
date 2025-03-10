// norseIAF.ts

import { CheckboxInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { iafParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.IAF",
  title: "IAF",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, iafParametersType),
    record_states: () => new CheckboxInterface("record_states", false).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const nodes = this.node.getConnectedNodesByInterface("p");
    if (nodes.length > 0) args.push(`p=${this.code?.graph.formatLabels(nodes).join(", ")}`);
    if (this.node.inputs.record_states.value) args.push(`record_states=True`);

    return `norse.torch.IAF(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "model",
});
