// numpyArange.ts

import { NumberInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.arange",
  title: "arange",
  inputs: {
    start: () => new NumberInterface("start", 0).use(setType, numberType),
    stop: () => new NumberInterface("stop", 1).use(setType, numberType),
    step: () => new NumberInterface("step", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "a",
  codeTemplate: () => "np.arange({{ inputs.start.value }}, {{ inputs.stop.value }}, {{ inputs.step.value }})",
});
