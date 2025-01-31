// nestSpatialFree.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { IntegerInterface } from "baklavajs";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "nest.spatial.free",
  title: "free position",
  inputs: {
    pos: () => new NodeInputInterface("pos"),
    num_dimensions: () => new IntegerInterface("num dimensions", 2, 2, 3),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "pos",
  codeTemplate() {
    if (!this.node)
      return "nest.spatial.free({{ inputs.pos.value }}, num_dimensions={{ inputs.num_dimensions.value }})";
    const posNodes = this.node.getConnectedNodesByInterface("pos");
    const posLabels = posNodes.map((node: AbstractCodeNode) => node.label);
    return `nest.spatial.free(${posLabels.join(", ")}, num_dimensions=${this.node.inputs.num_dimensions.value})`;
  },
});
