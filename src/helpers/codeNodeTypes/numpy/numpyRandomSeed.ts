// numpyRandomSeed.ts

import { IntegerInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.random.seed",
  title: "Random seed",
  inputs: {
    seed: () => new IntegerInterface("low", 0),
  },
  codeTemplate: () => "np.random.seed({{ inputs.seed.value }})",
});
