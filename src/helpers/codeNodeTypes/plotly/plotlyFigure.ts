// plotlyFigure.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Figure",
  title: "figure",
  inputs: {
    trace: () => new NodeInputInterface("trace"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate: () => "plotly.graph_objects.Figure()",
});
