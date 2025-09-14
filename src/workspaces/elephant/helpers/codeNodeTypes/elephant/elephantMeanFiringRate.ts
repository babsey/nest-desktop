// elephantMeanFiringRate.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.statistics.mean_firing_rate",
  modules: ["quantities"],
  title: "mean firing rate",
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

    return `elephant.statistics.mean_firing_rate(${args.join(", ")})`;
  },
  variableName: "rate",
});
