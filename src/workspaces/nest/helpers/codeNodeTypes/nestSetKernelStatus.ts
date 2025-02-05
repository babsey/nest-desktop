// nestSetKernelStatus.ts

import { displayInSidebar, IntegerInterface, NumberInterface } from "baklavajs";

import { NESTCode } from "../code/code";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.SetKernelStatus",
  title: "set kernel status",
  inputs: {
    local_num_threads: () =>
      new IntegerInterface("Local number of threads", 1, 1).use(displayInSidebar, true).setHidden(true),
    resolution: () => new NumberInterface("Resolution", 0.1, 0.001, 10).use(displayInSidebar, true).setHidden(true),
    rng_seed: () => new IntegerInterface("RNG Seed", 1, 1).use(displayInSidebar, true).setHidden(true),
  },
  onCreate() {
    this.state.position = "top";
  },
  onPlaced() {
    if (!this.code) return;
    const code = this.code as NESTCode;
    this.simulationItem = code.project.simulation.kernel;
    this.simulationItem.codeNode = this;
  },
  codeTemplate() {
    const status = [
      '"local_num_threads": {{ inputs.local_num_threads.value }}',
      '"resolution": {{ inputs.resolution.value }}',
      '"rng_seed": {{ inputs.rng_seed.value }}',
    ];
    return `nest.SetKernelStatus({\n\t${status.join(",\n\t")}\n})`;
  },
});
