// numpyHistogram.ts

import { INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.histogram",
  title: "histogram",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x"),
    bins: () => new NodeInputInterface<string>("bins"),
  },
  outputs: {
    hist: () => new NodeOutputInterface<INumpyArray>(),
    bin_edges: () => new NodeOutputInterface<INumpyArray>(),
  },
  variableName: "hist",
  codeTemplate: (node) => {
    if (!node) return "np.histogram({{ inputs.x.value }}, {{ inputs.bins.value }})";
    const xNodes = node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `np.histogram(${xLabels.join("+")}, ${node.inputs.bins.value})`;
  },
});
