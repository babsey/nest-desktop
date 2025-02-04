// numpyFull.ts

import { IntegerInterface, NumberInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

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
    return `np.full(${this.node.inputs.shape.value}, ${this.node.inputs.fill_value.value})`;
  },
});
