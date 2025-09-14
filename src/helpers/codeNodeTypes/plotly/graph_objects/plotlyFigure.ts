// plotlyFigure.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatLabels } from "@/codeGraph";

export default defineCodeNode({
  type: "plotly.graph_objects.Figure",
  title: "Figure",
  inputs: {
    trace: () => new NodeInputInterface("trace"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const trace = this.node.getConnectedNodesByInterface("trace");
    if (trace.length > 1) args.push(`data=[${formatLabels(trace).join(", ")}]`);
    else if (trace.length === 1) args.push(`data=${formatLabels(trace).join(", ")}`);

    return `go.Figure(${args.join(", ")})`;
  },
});
