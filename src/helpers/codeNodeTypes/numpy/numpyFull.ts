// numpyFull.ts

import { IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, numberType } from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.full",
  title: "full",
  inputs: {
    shape: () => new IntegerInterface("shape", 1).use(setType, numberType),
    fill_value: () => new NumberInterface("fill_value", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const shape = this.node.getConnectedNodeByInterface("shape");
    if (shape != undefined) args.push(`shape=${shape.value}`);
    else args.push(`shape=${this.node.inputs.shape.value}`);

    const fill_value = this.node.getConnectedNodeByInterface("fill_value");
    if (fill_value != undefined) args.push(`fill_value=${fill_value.value}`);
    else args.push(`fill_value=${this.node.inputs.fill_value.value}`);

    return `np.full(${args.join(", ")})`;
  },
  variableName: "values",
});
