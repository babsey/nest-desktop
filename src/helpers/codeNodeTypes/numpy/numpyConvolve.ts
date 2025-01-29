// numpyConvolve.ts

import { SelectInterface, setType } from "baklavajs";

import { INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.convolve",
  title: "convolve",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a"),
    v: () => new NodeInputInterface<INumpyArray>("v"),
    mode: () => new SelectInterface("mode", "valid", ["valid", "same", "full"]).use(setType, stringType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>(),
  },
  variableName: "conv",
  codeTemplate: (node) => {
    if (!node) return 'np.convolve({{ inputs.a.value }}, {{ inputs.v.value }}, "{{ inputs.mode.value }}")';
    const aNodes = node.getConnectedNodesByInterface("a");
    const vNodes = node.getConnectedNodesByInterface("v");
    if (aNodes.length === 0 || vNodes.length === 0) return node.type;
    const aLabels = aNodes.map((node) => node.label);
    const vLabels = vNodes.map((node) => node.label);
    return `np.convolve(${aLabels.join("+")}, ${vLabels.join("+")}, "{{ inputs.mode.value }}")`;
  },
});
