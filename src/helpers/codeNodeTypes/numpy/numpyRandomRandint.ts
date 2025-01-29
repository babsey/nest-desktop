// numpyRandomRandint.ts

import { IntegerInterface, setType } from "baklavajs";

import { INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
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
    out: () => new NodeOutputInterface<INumpyArray>(),
  },
  codeTemplate: (node) =>
    node
      ? `np.random.randint(${node.inputs.low.value}, ${node.inputs.high.value}, ${node.inputs.size.value})`
      : "np.random.randint({{ inputs.low.value }}, {{ inputs.high.value }}, {{ inputs.size.value }})",
});
