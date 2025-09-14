// plotlyBar.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "plotly.graph_objects.Bar",
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

    const x = this.node.getConnectedNodeByInterface("x");
    if (x != undefined) args.push(`x=${x.value}`);

    const y = this.node.getConnectedNodeByInterface("y");
    if (y != undefined) args.push(`y=${y.value}`);

    return `go.Bar(${args.join(", ")})`;
  },
});
