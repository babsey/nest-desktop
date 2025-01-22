// nestDataResponse.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    positions: () => new NodeInputInterface("positions"),
  },
  onCreate() {
    this.state.position = "bottom";
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const outputInterfaces = this.node.getConnectedInterfaceByInterface("events") as NodeOutputInterface[];
    const events = this.code?.graph.formatInterfaceLabels(outputInterfaces);
    if (events && events.length > 0) responseData.push(`"events": [${events.join(", ")}]`);

    const positions = this.node.getConnectedNodesByInterface("positions");
    const getPositions = positions.map((pos) => `getPos(${pos.label})`);
    if (getPositions.length === 1) responseData.push(`"positions": ${getPositions.join(", ")}`);
    else if (getPositions.length > 1)
      responseData.push(`"positions": [${getPositions.map((p) => "..." + p).join(", ")}]`);

    if (responseData.length === 0) return "response = {}";
    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
