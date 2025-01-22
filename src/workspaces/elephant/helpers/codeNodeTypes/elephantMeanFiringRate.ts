// elephantMeanFiringRate.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.statistics.mean_firing_rate",
  title: "Mean Firing Rate",
  inputs: {
    spiketrains: () => new NodeInterface("spiketrains", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "elephant.statistics.mean_firing_rate()",
});
