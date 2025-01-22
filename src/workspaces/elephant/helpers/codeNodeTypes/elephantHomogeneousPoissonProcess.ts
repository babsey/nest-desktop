// elephantHomogeneousPoissonProcess.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_poisson_process",
  title: "Homogeneous Poisson Process",
  inputs: {
    rate: () => new IntegerInterface("rate", 10),
    t_start: () => new IntegerInterface("t_start", 0),
    t_stop: () => new IntegerInterface("t_stop", 1),
  },
  outputs: {
    spiketrain: () => new NodeInterface("spiketrain", ""),
  },
  codeTemplate: () =>
    "{{ label }} = elephant.spike_train_generation.homogeneous_poisson_process(rate={{ inputs.rate.value }}, t_start={{ inputs.t_start.value }}, t_stop={{ inputs.t_stop.value }})",
});
