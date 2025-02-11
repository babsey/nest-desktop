// nestDataResponse.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    positions: () => new NodeInputInterface("positions"),
    plotly: () => new NodeInputInterface("plotly"),
  },
  onCreate() {
    this.state.position = "bottom";
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const events = this.node
      .getConnectedNodesByInterface("events")
      .map((node: AbstractCodeNode) => `${node.label}.events`);
    if (events.length > 0) responseData.push(`"events": [${events.join(", ")}]`);

    const positions = this.node.getConnectedNodesByInterface("positions");

    const getPositions = positions.map((pos) => `getPos(${pos.label})`);
    if (getPositions.length === 1) responseData.push(`"positions": ${getPositions.join(", ")}`);
    else if (getPositions.length > 1)
      responseData.push(`"positions": [${getPositions.map((p) => "..." + p).join(", ")}]`);

    const plotly = this.node.getConnectedNodesByInterface("plotly").map((node: AbstractCodeNode) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    if (responseData.length === 0) return "";
    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
