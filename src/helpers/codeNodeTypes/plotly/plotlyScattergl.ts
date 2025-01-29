// plotlyScatter.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scattergl",
  title: "scatter (gl)",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scattergl",
  codeTemplate: () => 'go.Scattergl(x={{ inputs.x.value }}, y={{ inputs.y.value }}, mode="markers")',
});
