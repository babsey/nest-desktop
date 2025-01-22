// elephantISI.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.statistics.isi",
  title: "Inter-Spike Interval",
  inputs: {
    spiketrains: () => new NodeInterface("spiketrains", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "elephant.statistics.isi()",
});
