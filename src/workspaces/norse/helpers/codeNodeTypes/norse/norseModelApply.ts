// apply.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

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
  codeTemplate() {
    if (!this.node) return this.type;
    const models = this.node.getConnectedNodesByInterface("model");
    if (models.length == 0) return this.type;

    const args: string[] = [];

    const inputs = this.node.getConnectedNodeByInterface("inputs");
    if (inputs != undefined) args.push(`${inputs.value}`);

    const state = this.node.getConnectedNodeByInterface("state");
    if (state != undefined) args.push(`${state.value}`);

    return `${models[0].label}(${args.join(", ")})`;
  },
  variableName: "out",
});
