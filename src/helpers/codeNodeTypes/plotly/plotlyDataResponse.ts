// plotlyDataResponse.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "plotly/response",
  title: "plotly response",
  inputs: {
    plotly: () => new NodeInputInterface("plotly"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const plotly = this.node
      .getConnectedOutputInterfacesByInterface("plotly")
      .map((node: NodeOutputInterface) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
