// numpyCorrCoef.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.corrcoef",
  title: "correlation coefficients",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const x = this.node.getConnectedNodeByInterface("x");
    if (x != undefined) args.push(`x=${x.value}`);

    return `np.corrcoef(${args.join(", ")})`;
  },
  variableName: "corrcoef",
});
