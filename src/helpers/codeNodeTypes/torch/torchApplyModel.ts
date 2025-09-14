// torchApplyModel.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "torch/applyModel",
  title: "apply model",
  inputs: {
    className: () => new TextInputInterface("name", "NetworkModel"),
    model: () => new NodeInputInterface("model"),
    to: () => new NodeInputInterface("to"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    parameters: () => new NodeOutputInterface("parameters", ".parameters()"),
  },
  variableName: "model",
  codeTemplate() {
    if (!this.node) return this.type;
    let code = "";

    const modelInt = this.node.getConnectedNodeByInterface("model");
    let model: string = "";
    if (modelInt != undefined) model = `${modelInt.value}`;

    code = `${this.node.inputs.className.value}(${model})`;

    const toInt = this.node.getConnectedNodeByInterface("to");
    if (toInt != undefined) code += `.to(${toInt.value})`;

    return code;
  },
});
