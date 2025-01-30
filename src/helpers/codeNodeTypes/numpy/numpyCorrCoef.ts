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
  variableName: "cc",
  codeTemplate: (node) => {
    if (!node) return "np.corrcoef({{ inputs.x.value }})";
    const xNodes = node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `np.corrcoef(${xLabels.join(", ")})`;
  },
});
