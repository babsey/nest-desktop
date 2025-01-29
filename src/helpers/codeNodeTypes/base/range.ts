// listComprehension.ts

import { IntegerInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "range",
  title: "range",
  inputs: {
    start: () => new IntegerInterface("start", 0),
    stop: () => new IntegerInterface("stop", 1),
    step: () => new IntegerInterface("step", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: (node) => {
    if (!node) return "range({{ inputs.start.value }}, {{ inputs.stop.value }}, {{ inputs.step.value }})";
    return `range(${node.inputs.start.value}, ${node.inputs.stop.value}, ${node.inputs.step.value})`;
  },
});
