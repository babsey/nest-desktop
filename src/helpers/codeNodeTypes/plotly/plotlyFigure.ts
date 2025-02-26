// plotlyFigure.ts

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Figure",
  modules: ["plotly.graph_objects"],
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
    if (trace.length === 1) args.push(`data=${this.code?.graph.formatLabels(trace).join(", ")}`);
    else if (trace.length > 1) args.push(`data=[${this.code?.graph.formatLabels(trace).join(", ")}]`);

    return `go.Figure(${args.join(", ")})`;
  },
});
