// plotlyFigureAddTrace.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.fig.add_trace",
  title: "add trace",
  inputs: {
    fig: () => new NodeInputInterface("fig"),
    trace: () => new NodeInputInterface("trace"),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const fig = this.node.getConnectedNodesByInterface("fig");
    const figname = this.code?.graph.formatLabels(fig).join(", ");

    const args = [];

    const trace = this.node.getConnectedNodesByInterface("trace");
    if (trace.length === 1) args.push(`trace=${this.code?.graph.formatLabels(trace).join(", ")}`);

    return `${figname}.add_trace(${args.join(", ")})`;
  },
});
