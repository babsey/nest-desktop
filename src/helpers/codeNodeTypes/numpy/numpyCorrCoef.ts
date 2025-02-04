// numpyCorrCoef.ts

import { setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.corrcoef",
  title: "correlation coefficients",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "corrcoef",
  codeTemplate() {
    if (!this.node) return this.type;
    const xNodes = this.node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return this.node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `np.corrcoef(${xLabels.join(", ")})`;
  },
});
