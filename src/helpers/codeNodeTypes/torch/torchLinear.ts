// norseLinear.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, formatInterfaceLabel, numberType } from "@/codeGraph";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.Linear",
  title: "linear",
  inputs: {
    in_features: () => new IntegerInterface("in features", 1).use(setType, numberType),
    out_features: () => new IntegerInterface("out features", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "lin",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const inFeatures = this.node.getConnectedOutputInterfaceByInterface("in_features");
    if (inFeatures != undefined) args.push(`in_features=${formatInterfaceLabel(inFeatures)}`);

    const outFeatures = this.node.getConnectedOutputInterfaceByInterface("out_features");
    if (outFeatures != undefined) args.push(`out_features=${formatInterfaceLabel(outFeatures)}`);

    return `torch.nn.Linear(${args.join(", ")})`;
  },
});
