// pynnRun.ts

import { displayInSidebar, IntegerInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pynn.run",
  title: "run",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true).setPort(false),
  },
  codeTemplate: (node) => (node ? `pynn.run(${node.inputs.time.value})` : "pynn.run({{ inputs.time.value }})"),
});
