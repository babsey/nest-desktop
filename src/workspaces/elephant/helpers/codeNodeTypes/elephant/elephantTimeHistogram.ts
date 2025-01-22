// elephantTimeHistogram.ts

import { displayInSidebar, IntegerInterface, SelectInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.statistics.time_histogram",
  modules: ["quantities"],
  title: "time histogram",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    binSize: () => new IntegerInterface("bin_size", 50).use(setType, numberType),
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
    if (spiketrains.length > 1) args.push(`[${this.code?.graph.formatLabels(spiketrains).join(", ")}]`);
    else if (spiketrains.length > 0) args.push(`${this.code?.graph.formatLabels(spiketrains).join(", ")}`);

    const binSize = this.node.getConnectedNodesByInterface("bin_size");
    if (binSize.length > 0) args.push(`${this.code?.graph.formatLabels(binSize).join(", ")} * pq.s`);

    const output = this.node.inputs.output.value;
    if (output !== "counts") args.push(`output="${output}"`);

    return `elephant.statistics.time_histogram(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "ts_hist",
});
