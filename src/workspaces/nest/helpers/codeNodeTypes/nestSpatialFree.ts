// nestSpatialFree.ts

import { IntegerInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

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
    const args = [];
    const posNodes = this.node.getConnectedNodesByInterface("pos");
    if (posNodes.length > 0) args.push(`${this.code?.graph.formatLabels(posNodes).join(", ")}`);
    args.push(`num_dimensions=${this.node.inputs.num_dimensions.value}`);
    return `nest.spatial.free(\n\t${args.join(",\n\t")}\n)`;
  },
});
