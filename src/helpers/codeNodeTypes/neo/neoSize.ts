// neoSpiketrain.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "neo.core.spikeTrain",
  title: "spiketrain",
  inputs: {
    times: () => new NodeInputInterface("times"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "neo.core.SpikeTrain({{ inputs.times.value }})",
});
