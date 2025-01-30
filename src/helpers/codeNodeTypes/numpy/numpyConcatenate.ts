// numpyConcatenate.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.concatenate",
  title: "concatenate",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  variableName: "concat",
  codeTemplate() {
    if (!this.node) return 'np.concatenate({{ inputs.a.value }}")';
    const aNodes = this.node.getConnectedNodesByInterface("a");
    if (aNodes.length === 0) return this.node.type;
    const aLabels = aNodes.map((node) => node.label);
    return `np.concatenate(${aLabels.join(", ")})`;
  },
});
