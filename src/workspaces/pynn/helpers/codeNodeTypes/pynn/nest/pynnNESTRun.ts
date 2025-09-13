// pynnNESTRun.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";
import { defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.nest.run",
  modules: ["pyNN.nest"],
  title: "run",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate: () => "pyNN.nest.run({{ inputs.time.value }})",
});
