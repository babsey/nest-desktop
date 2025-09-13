// numpyHistogram.ts

import { IntegerInterface, setType } from "baklavajs";

import {
  NodeInputInterface,
  NodeOutputInterface,
  defineCodeNode,
  formatInterfaceLabel,
  formatInterfaceLabels,
} from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.histogram",
  title: "histogram",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
    bins: () => new IntegerInterface("bins", 10),
  },
  outputs: {
    hist: () => new NodeOutputInterface<INumpyArray>("hist", "[0]").use(setType, arrayType),
    bin_edges: () => new NodeOutputInterface<INumpyArray>("bin_edges", "[1]").use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const x = this.node.getConnectedOutputInterfacesByInterface("x");
    if (x.length > 0) args.push(`${formatInterfaceLabels(x).join("+")}`);

    const bins = this.node.getConnectedOutputInterfaceByInterface("bins");
    if (bins != undefined) args.push(`${formatInterfaceLabel(bins)}`);
    else args.push(`${this.node.inputs.bins.value}`);

    return `np.histogram(${args.join(", ")})`;
  },
  variableName: "hist",
});
