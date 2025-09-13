// elephantMeanFiringRate.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

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

    const spiketrain = this.node.getConnectedOutputInterfaceByInterface("spiketrain");
    if (spiketrain != undefined) args.push(`${formatInterfaceLabel(spiketrain)}`);

    return `elephant.statistics.mean_firing_rate(${args.join(", ")})`;
  },
  variableName: "rate",
});
