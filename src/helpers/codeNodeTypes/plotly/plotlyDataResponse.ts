// response.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "plotly/response",
  title: "plotly response",
  inputs: {
    plotly: () => new NodeInputInterface("plotly"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const plotly = this.node.getConnectedNodesByInterface("plotly").map((node: AbstractCodeNode) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
