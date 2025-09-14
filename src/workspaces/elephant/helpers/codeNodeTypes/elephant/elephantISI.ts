// elephantISI.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.statistics.isi",
  title: "inter-spike interval",
  inputs: {
    spiketrain: () => new NodeInputInterface("spiketrain"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrain = this.node.getConnectedNodeByInterface("spiketrain");
    if (spiketrain != undefined) args.push(`${spiketrain.value}`);

    return `elephant.statistics.isi(${args.join(", ")})`;
  },
  variableName: "intervals",
});
