// pynnNESTSetup.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";
import { defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.nest.setup",
  modules: ["pyNN.nest"],
  title: "setup",
  inputs: {
    timestep: () => new IntegerInterface("timestep", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate: () => "pyNN.nest.setup({{ inputs.time.value }})",
});
