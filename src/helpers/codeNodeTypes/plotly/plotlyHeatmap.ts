// plotlyHeatmap.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Heatmap",
  modules: ["plotly.graph_objects"],
  title: "heatmap",
  inputs: {
    z: () => new NodeInputInterface("z"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "heatmap",
  codeTemplate() {
    if (!this.node) return this.type;
    return `go.Heatmap(${this.node.inputs.x.value}, ${this.node.inputs.y.value})`;
  },
});
