// response.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "response",
  title: "response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    positions: () => new NodeInputInterface("positions"),
    plotly: () => new NodeInputInterface("plotly"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const events = this.node
      .getConnectedNodesByInterface("events")
      .map((node: AbstractCodeNode) => `${node.label}.events`);
    if (events.length > 0) responseData.push(`"events": [${events.join(", ")}]`);

    const positions = this.node
      .getConnectedNodesByInterface("positions")
      .map((node: AbstractCodeNode) => `nest.GetPosition(${node.label})`);
    if (positions.length > 0) responseData.push(`"positions": [${positions.join(", ")}]`);

    const plotly = this.node.getConnectedNodesByInterface("plotly").map((node: AbstractCodeNode) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
