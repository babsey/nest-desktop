// numpyConvolve.ts

import { SelectInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.convolve",
  title: "convolve",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
    v: () => new NodeInputInterface<INumpyArray>("v").use(setType, arrayType),
    mode: () => new SelectInterface("mode", "valid", ["valid", "same", "full"]).use(setType, stringType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "conv",
  codeTemplate() {
    if (!this.node) return this.type;
    const aNodes = this.node.getConnectedNodesByInterface("a");
    const vNodes = this.node.getConnectedNodesByInterface("v");
    if (aNodes.length === 0 || vNodes.length === 0) return this.node.type;
    const aLabels = aNodes.map((node) => node.label);
    const vLabels = vNodes.map((node) => node.label);
    return `np.convolve(${aLabels.join("+")}, ${vLabels.join("+")}, "{{ inputs.mode.value }}")`;
  },
});
