// plotlyScatter.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scatter",
  modules: ["plotly.graph_objects"],
  title: "scatter",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scatter",
  codeTemplate() {
    if (!this.node) return 'go.Scatter(x={{ inputs.x.value }}, y={{ inputs.y.value }}, mode="markers")';
    const xNodes = this.node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return this.node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `go.Scatter(x=${xLabels.join(", ")}, mode="markers")`;
  },
});
