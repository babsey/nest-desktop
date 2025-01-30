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
  codeTemplate: (node) => {
    if (!node) return "px.Bar({{ inputs.x.value }}, {{ inputs.y.value }})";
    const xNodes = node.getConnectedNodesByInterface("x");
    if (xNodes.length === 0) return node.type;
    const xLabels = xNodes.map((xNode) => xNode.label);
    return `px.Bar(${xLabels.join(", ")})`;
  },
});
