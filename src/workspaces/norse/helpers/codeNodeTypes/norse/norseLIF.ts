// norseLIF.ts

import { CheckboxInterface, setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { lifParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIF",
  title: "LIF",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, lifParametersType),
    record_states: () => new CheckboxInterface("record_states", false).setPort(false),
    // input: () => new NodeInputInterface("input"),
    // state: () => new NodeInputInterface("state"),
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

    return `norse.torch.LIF(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "model",
});
