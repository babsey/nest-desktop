// elephantTimeHistogram.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.statistics.time_histogram",
  title: "Time Histogram",
  inputs: {
    spiketrains: () => new NodeInterface("spiketrains", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "elephant.statistics.time_histogram()",
});
