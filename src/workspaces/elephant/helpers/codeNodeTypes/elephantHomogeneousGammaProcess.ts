// elephantHomogeneousGammaProcess.ts

import { IntegerInterface, NodeInterface, NumberInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  title: "Homogeneous Gamma Process",
  inputs: {
    a: () => new IntegerInterface("a", 3),
    rate: () => new IntegerInterface("rate", 10),
    t_start: () => new NumberInterface("t_start", 0),
    t_stop: () => new NumberInterface("t_stop", 10000),
  },
  outputs: {
    spiketrain: () => new NodeInterface("spiketrain", ""),
  },
  codeTemplate: () =>
    "{{ label }} = elephant.spike_train_generation.homogeneous_Gamma_process(a={{ inputs.a.value }}, rate={{ inputs.rate.value }}, t_start={{ inputs.t_start.value }}, t_stop={{ inputs.t_stop.value }})",
});
