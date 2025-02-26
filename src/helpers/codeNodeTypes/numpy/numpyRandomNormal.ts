// numpyRandomNormal.ts

import { IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.normal",
  title: "random normal distribution",
  inputs: {
    loc: () => new IntegerInterface("loc", 0).use(setType, numberType),
    scale: () => new IntegerInterface("scale", 1).use(setType, numberType),
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "normal",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const loc = this.node.getConnectedNodesByInterface("loc");
    if (loc.length > 0) args.push(`loc=${this.code?.graph.formatLabels(loc).join(", ")}`);
    else if (this.node.inputs.loc.value !== 0) args.push(`loc=${this.node.inputs.loc.value}`);

    const scale = this.node.getConnectedNodesByInterface("scaleh");
    if (scale.length > 0) args.push(`scale=${this.code?.graph.formatLabels(scale).join(", ")}`);
    else if (this.node.inputs.scale.value !== 1) args.push(`scale=${this.node.inputs.scale.value}`);

    const size = this.node.getConnectedNodesByInterface("size");
    if (size.length > 0) args.push(`size=${this.code?.graph.formatLabels(size).join(", ")}`);
    else if (this.node.inputs.size.value !== 1) args.push(`size=${this.node.inputs.size.value}`);

    return `np.random.normal(${args.join(", ")})`;
  },
});
