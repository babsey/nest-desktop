// plotlyFigure.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Figure",
  modules: ["plotly.graph_objects"],
  title: "figure",
  inputs: {
    trace: () => new NodeInputInterface("trace"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate: (node) => {
    if (!node) return "go.Figure()";
    const traces = node.getConnectedNodesByInterface("trace");
    if (traces.length === 0) return "go.Figure()";
    const traceLabels = traces.map((trace) => trace.label);
    return `go.Figure([${traceLabels.join(", ")}])`;
  },
});
