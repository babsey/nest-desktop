// brainscales2HxNeuron.ts

import { NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.HXNeuron",
  title: "HX neuron",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "pynn.cells.HXNeuron()",
});
