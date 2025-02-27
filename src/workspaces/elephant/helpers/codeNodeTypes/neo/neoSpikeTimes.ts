// text.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "neo/spikeTimes",
  title: "spike times",
  inputs: {
    spiketrain: () => new NodeInputInterface("spiketrain"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "times",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrain = this.node.getConnectedNodesByInterface("spiketrain");
    if (spiketrain.length > 0) args.push(`${this.code?.graph.formatLabels(spiketrain).join(", ")}`);

    return `${args.join("+")}.times`;
  },
});
