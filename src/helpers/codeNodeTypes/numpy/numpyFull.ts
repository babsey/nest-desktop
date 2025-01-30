// numpyFull.ts

import { NumberInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.full",
  title: "full",
  inputs: {
    shape: () => new NumberInterface("shape", 1).use(setType, numberType),
    fill_value: () => new NumberInterface("fill_value", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate: (node) =>
    node
      ? `np.full(${node.inputs.shape.value}, ${node.inputs.fill_value.value})`
      : "np.full({{ inputs.shape.value }}, {{ inputs.fill_value.value }})",
});
