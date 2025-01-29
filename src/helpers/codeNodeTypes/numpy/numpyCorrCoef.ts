// numpyCorrCoef.ts

import { INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.corrcoef",
  title: "correlation coefficients",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x"),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>(),
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
