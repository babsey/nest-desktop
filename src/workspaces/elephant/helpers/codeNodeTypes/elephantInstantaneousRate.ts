// elephantInstantaneousRate.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.statistics.instantaneous_rate",
  title: "Instantaneous Rate",
  inputs: {
    spiketrains: () => new NodeInterface("spiketrains", ""),
    sampling_period: () => new IntegerInterface("sampling period", 0),
  },
  outputs: {
    out: () => new NodeInterface("inst_rate", ""),
  },
  codeTemplate: () => "elephant.statistics.instantaneous_rate()",
});
