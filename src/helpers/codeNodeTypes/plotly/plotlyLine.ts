// plotlyLine.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Line",
  modules: ["plotly.graph_objects"],
  title: "line",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "line",
  codeTemplate() {
    if (!this.node) return this.type;
    return `go.Line(${this.node.inputs.x.value}, ${this.node.inputs.y.value})`;
  },
});
