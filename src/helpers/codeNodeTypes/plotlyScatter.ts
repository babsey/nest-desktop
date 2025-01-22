// plotlyScatter.ts

import { NodeInterface } from "baklavajs";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Scatter",
  title: "Scatter",
  inputs: {
    x: () => new NodeInterface("x", null),
    y: () => new NodeInterface("y", null),
  },
  codeTemplate: () => "go.Scatter({{ inputs.x.value }}, {{ inputs.y.value }})",
});
