// elephantTimeHistogram.ts

import { displayInSidebar, IntegerInterface, SelectInterface, setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatLabels, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.statistics.time_histogram",
  modules: ["quantities"],
  title: "time histogram",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    binSize: () =>
      new IntegerInterface("bin_size", 50).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    output: () =>
      new SelectInterface("output", "counts", ["counts", "mean", "rate"]).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrains = this.node.getConnectedNodesByInterface("spiketrains");
    if (spiketrains.length > 1) args.push(`[${formatLabels(spiketrains).join(", ")}]`);
    else if (spiketrains.length > 0) args.push(`${formatLabels(spiketrains).join(", ")}`);

    const binSize = this.node.getConnectedNodeByInterface("bin_size");
    if (binSize != undefined) args.push(`${binSize.value}*pq.s`);
    else if (!this.node.inputs.binSize.hidden) args.push(`${this.node.inputs.binSize.value}*pq.s`);

    if (!this.node.inputs.output.hidden) args.push(`output="${this.node.inputs.output.value}"`);

    return `elephant.statistics.time_histogram(${args.join(", ")})`;
  },
  variableName: "ts_hist",
});
