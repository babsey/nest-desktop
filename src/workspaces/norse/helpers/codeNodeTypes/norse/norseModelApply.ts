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
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    // output: () => new NodeOutputInterface(),
    // state: () => new NodeOutputInterface(),
  },
  variableName: "out",
  codeTemplate() {
    if (!this.node) return this.type;
    const models = this.node.getConnectedNodesByInterface("model");
    if (models.length == 0) return this.type;
    const inputs = this.node.getConnectedNodesByInterface("inputs");
    return `${models[0].label}(${this.code?.graph.formatLabels(inputs).join(", ")})`;
  },
});
