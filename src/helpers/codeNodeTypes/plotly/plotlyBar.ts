// plotlyBar.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Bar",
  modules: ["plotly.graph_objects"],
  title: "Bar",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "bar",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const x = this.node.getConnectedNodesByInterface("x");
    if (x.length > 0) args.push(`x=${this.code?.graph.formatLabels(x).join(", ")}`);

    const y = this.node.getConnectedNodesByInterface("y");
    if (y.length > 0) args.push(`y=${this.code?.graph.formatLabels(y).join(", ")}`);

    return `go.Bar(${args.join(", ")})`;
  },
});
