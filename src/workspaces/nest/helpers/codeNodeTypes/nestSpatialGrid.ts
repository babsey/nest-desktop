// nestSpatialGrid.ts

import { IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.spatial.grid",
  title: "grid position",
  inputs: {
    x: () => new IntegerInterface("x", 1),
    y: () => new IntegerInterface("y", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "pos",
  codeTemplate: () => "nest.spatial.grid([{{ inputs.x.value }}, {{ inputs.y.value }}])",
});
