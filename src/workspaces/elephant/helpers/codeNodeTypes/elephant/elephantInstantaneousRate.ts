// elephantInstantaneousRate.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatLabels, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.statistics.instantaneous_rate",
  title: "instantaneous rate",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    sampling_period: () => new IntegerInterface("sampling period", 0).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrains = this.node.getConnectedNodesByInterface("spiketrains");
    if (spiketrains.length > 1) args.push(`[${formatLabels(spiketrains).join(", ")}]`);
    if (spiketrains.length > 0) args.push(`${formatLabels(spiketrains).join(", ")}`);

    const samplingPeriod = this.node.getConnectedNodeByInterface("sampling_period");
    if (samplingPeriod != undefined) args.push(`${samplingPeriod.value}`);
    else if (!this.node.inputs.sampling_period.hidden) args.push(`${this.node.inputs.sampling_period.value}`);

    return `elephant.statistics.instantaneous_rate(${args.join(", ")})`;
  },
  variableName: "ir",
});
