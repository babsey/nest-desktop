// elephantCV.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "elephant.statistics.cv",
  title: "coefficient of variation",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "cv",
  codeTemplate: (node) =>
    node
      ? `elephant.statistics.cv(${node.inputs.spiketrains.label})`
      : "elephant.statistics.cv({{ inputs.spiketrains.label }})",
});
