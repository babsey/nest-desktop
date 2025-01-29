// elephantMeanFiringRate.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "elephant.statistics.mean_firing_rate",
  title: "mean firing rate",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "rate",
  codeTemplate: () => "elephant.statistics.mean_firing_rate()",
});
