// torchConv2d.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, formatLabels, numberType } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.Conv2d",
  title: "convolve (2D)",
  inputs: {
    in_channel: () =>
      new IntegerInterface("in channel", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    out_channel: () =>
      new IntegerInterface("out channel", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    kernel_size: () =>
      new IntegerInterface("kernel size", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    stride: () =>
      new IntegerInterface("stride", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    padding: () =>
      new IntegerInterface("padding", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    dilation: () =>
      new IntegerInterface("dilation", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "conv",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const inChannel = this.node.getConnectedNodeByInterface("in_channel");
    if (inChannel != undefined) args.push(`in_channel=${inChannel.value}`);

    const outChannel = this.node.getConnectedNodeByInterface("out_channel");
    if (outChannel != undefined) args.push(`out_channel=${outChannel.value}`);

    const kernelSize = this.node.getConnectedNodesByInterface("kernel_size");
    if (kernelSize.length > 1) args.push(`kernel_size=(${formatLabels(kernelSize).join(", ")})`);
    else if (kernelSize.length > 0) args.push(`kernel_size=${formatLabels(kernelSize).join(", ")}`);

    const stride = this.node.getConnectedNodesByInterface("stride");
    if (stride.length > 1) args.push(`stride=(${formatLabels(stride).join(", ")})`);
    else if (stride.length > 0) args.push(`stride=${formatLabels(stride).join(", ")}`);

    const padding = this.node.getConnectedNodesByInterface("padding");
    if (padding.length > 1) args.push(`padding=(${formatLabels(padding).join(", ")})`);
    else if (padding.length > 0) args.push(`padding=${formatLabels(padding).join(", ")}`);

    const dilation = this.node.getConnectedNodesByInterface("dilation");
    if (dilation.length > 1) args.push(`dilation=(${formatLabels(dilation).join(", ")})`);
    else if (dilation.length > 0) args.push(`dilation=${formatLabels(dilation).join(", ")}`);

    return `torch.nn.Conv2d(${args.join(", ")})`;
  },
});
