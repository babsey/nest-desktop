// plotlyScatter.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scattergl",
  modules: ["plotly.graph_objects"],
  title: "scatter (gl)",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scattergl",
  codeTemplate() {
    if (!this.node) return this.type;
    const xNodes = this.node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return this.node.type;
    const xLabels = xNodes.map((node) => node.label);
    return `go.Scattergl(x=${xLabels.join(", ")}, mode="markers")`;
  },
});
