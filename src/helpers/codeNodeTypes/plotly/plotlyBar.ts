// plotlyBar.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Bar",
  modules: ["plotly.graph_objects"],
  title: "bar",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "bar",
  codeTemplate() {
    if (!this.node) return "go.Bar({{ inputs.x.value }}, {{ inputs.y.value }})";
    const xNodes = this.node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return this.node.type;
    const xLabels = xNodes.map((xNode) => xNode.label);
    return `go.Bar(${xLabels.join(", ")})`;
  },
});
