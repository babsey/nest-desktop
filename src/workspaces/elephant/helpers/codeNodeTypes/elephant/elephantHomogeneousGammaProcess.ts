// elephantHomogeneousGammaProcess.ts

import { IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  title: "homogeneous gamma process",
  inputs: {
    a: () => new IntegerInterface("a", 3).use(setType, numberType),
    rate: () => new IntegerInterface("rate", 10).use(setType, numberType),
    t_start: () => new NumberInterface("t_start", 0).use(setType, numberType),
    t_stop: () => new NumberInterface("t_stop", 10000).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "st_gp",
  codeTemplate: (node) =>
    node
      ? `elephant.spike_train_generation.homogeneous_gamma_process(a=${node.inputs.a.value}, rate=${node.inputs.rate.value}, t_start=${node.inputs.t_start.value}, t_stop=${node.inputs.t_stop.value})`
      : "elephant.spike_train_generation.homogeneous_gamma_process(a={{ inputs.a.value }}, rate={{ inputs.rate.value }}, t_start={{ inputs.t_start.value }}, t_stop={{ inputs.t_stop.value }})",
});
