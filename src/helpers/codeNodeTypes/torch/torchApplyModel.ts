// torchApplyModel.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

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

    const modelInt = this.node.getConnectedOutputInterfaceByInterface("model");
    let model: string = "";
    if (modelInt != undefined) model = `${formatInterfaceLabel(modelInt)}`;

    code = `${this.node.inputs.className.value}(${model})`;

    const toInt = this.node.getConnectedOutputInterfaceByInterface("to");
    if (toInt != undefined) code += `.to(${formatInterfaceLabel(toInt)})`;

    return code;
  },
});
