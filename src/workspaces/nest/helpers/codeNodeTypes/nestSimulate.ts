// nestSimulate.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NESTCode } from "../code/code";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "nest.Simulate",
  title: "simulate",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  onCreate() {
    this.state.position = "bottom";
  },
  onPlaced() {
    if (!this.code) return;
    const code = this.code as NESTCode;
    this.simulationItem = code.project.simulation;
    this.simulationItem.codeNode = this;
  },
  codeTemplate: () => "nest.Simulate({{ inputs.time.value }})",
});
