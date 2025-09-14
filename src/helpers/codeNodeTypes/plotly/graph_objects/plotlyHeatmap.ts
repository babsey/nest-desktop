// plotlyHeatmap.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "plotly.graph_objects.Heatmap",
  title: "Heatmap",
  inputs: {
    z: () => new NodeInputInterface("z"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "heatmap",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const z = this.node.getConnectedNodeByInterface("z");
    if (z != undefined) args.push(`z=${z.value}`);

    return `go.Heatmap(${args.join(", ")})`;
  },
});
