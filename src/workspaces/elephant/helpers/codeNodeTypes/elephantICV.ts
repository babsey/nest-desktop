// elephantCV.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.statistics.cv",
  title: "Coefficient of Variation",
  inputs: {
    spiketrains: () => new NodeInterface("spiketrains", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "elephant.statistics.cv()",
});
