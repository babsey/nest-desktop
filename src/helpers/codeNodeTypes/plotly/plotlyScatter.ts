// plotlyScatter.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scatter",
  title: "scatter",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scatter",
  codeTemplate: () => 'go.Scatter(x={{ inputs.x.value }}, y={{ inputs.y.value }}, mode="markers")',
});
