// apply.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "norse/modelApply",
  title: "apply model",
  inputs: {
    model: () => new NodeInputInterface("model"),
    inputs: () => new NodeInputInterface("inputs"),
    state: () => new NodeInputInterface("state"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    output: () => new NodeOutputInterface("output", "[0]"),
    state: () => new NodeOutputInterface("state", "[1]"),
  },
  onCreate() {
    this.twoColumn = true;
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const models = this.node.getConnectedNodesByInterface("model");
    if (models.length == 0) return this.type;

    const args: string[] = [];

    const inputs = this.node.getConnectedNodesByInterface("inputs");
    if (inputs && inputs.length > 0) args.push(`${this.code?.graph.formatLabels(inputs).join(", ")}`);

    const state = this.node.getConnectedInterfaceByInterface("state") as NodeOutputInterface[];
    if (state && state.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(state).join(", ")}`);

    return `${models[0].label}(${args.join(", ")})`;
  },
  variableName: "out",
});
