// numpyConcatenate.ts

import { INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.concatenate",
  title: "concatenate",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a"),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>(),
  },
  variableName: "concat",
  codeTemplate: (node) => {
    if (!node) return 'np.concatenate({{ inputs.a.value }}")';
    const aNodes = node.getConnectedNodesByInterface("a");
    if (aNodes.length === 0) return node.type;
    const aLabels = aNodes.map((node) => node.label);
    return `np.concatenate(${aLabels.join(", ")})`;
  },
});
