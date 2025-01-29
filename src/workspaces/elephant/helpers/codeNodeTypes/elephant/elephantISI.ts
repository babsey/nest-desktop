// elephantISI.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "elephant.statistics.isi",
  title: "inter-spike interval",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "isi",
  codeTemplate: () => "elephant.statistics.isi()",
});
