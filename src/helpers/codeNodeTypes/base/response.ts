// response.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "response",
  title: "response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    plotly: () => new NodeInputInterface("plotly"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const events = this.node
      .getConnectedNodesByInterface("events")
      .map((node: AbstractCodeNode) => `${node.label}.events`);
    if (events.length > 0) responseData.push(`"events": [${events.join(", ")}]`);

    const plotly = this.node.getConnectedNodesByInterface("plotly").map((node: AbstractCodeNode) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
