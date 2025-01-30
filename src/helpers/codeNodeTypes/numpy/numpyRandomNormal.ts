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
  codeTemplate: (node) =>
    node
      ? `np.random.normal(${node.inputs.loc.value}, ${node.inputs.scale.value}, ${node.inputs.size.value})`
      : "np.random.normal({{ inputs.loc.value }}, {{ inputs.scale.value }}, {{ inputs.size.value }})",
});
