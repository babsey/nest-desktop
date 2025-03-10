// numpyRandomRandint.ts

import { IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.randint",
  title: "random integer",
  inputs: {
    low: () => new IntegerInterface("low", 0).use(setType, numberType),
    high: () => new IntegerInterface("high", 1).use(setType, numberType),
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword = "";

    const low = this.node.getConnectedNodesByInterface("low");
    if (low.length > 0) args.push(`${this.code?.graph.formatLabels(low).join(", ")}`);
    else if (this.node.inputs.low.value !== 0) args.push(`${this.node.inputs.low.value}`);

    const high = this.node.getConnectedNodesByInterface("high");
    if (high.length > 0) args.push(`${this.code?.graph.formatLabels(high).join(", ")}`);
    else args.push(`${this.node.inputs.high.value}`);

    keyword = args.length < 2 ? "size=" : "";
    const size = this.node.getConnectedNodesByInterface("size");
    if (size.length > 0) args.push(`${keyword}${this.code?.graph.formatLabels(size).join(", ")}`);
    else if (this.node.inputs.size.value > 0) args.push(`${keyword}${this.node.inputs.size.value}`);

    return `np.random.randint(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "randint",
});
