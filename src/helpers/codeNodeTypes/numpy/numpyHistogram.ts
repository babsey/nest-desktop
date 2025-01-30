// numpyHistogram.ts

import { setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.histogram",
  title: "histogram",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
    bins: () => new NodeInputInterface<string>("bins"),
  },
  outputs: {
    hist: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
    bin_edges: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "hist",
  codeTemplate() {
    if (!this.node) return "np.histogram({{ inputs.x.value }}, {{ inputs.bins.value }})";
    const xNodes = this.node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return this.node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `np.histogram(${xLabels.join("+")}, ${this.node.inputs.bins.value})`;
  },
});
