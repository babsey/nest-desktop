// elephantHomogeneousGammaProcess.ts

import { CheckboxInterface, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { booleanType, numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  title: "homogeneous gamma process",
  inputs: {
    a: () => new IntegerInterface("a", 3).use(setType, numberType),
    b: () => new IntegerInterface("b", 10).use(setType, numberType),
    t_start: () => new NumberInterface("t_start", 0).use(setType, numberType),
    t_stop: () => new NumberInterface("t_stop", 10000).use(setType, numberType),
    nd_array: () => new CheckboxInterface("nd_array", false).use(setType, booleanType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "st_gp",
  codeTemplate: (node) =>
    node
      ? `elephant.spike_train_generation.homogeneous_gamma_process(a=${node.inputs.a.value}, b=${node.inputs.b.value}*pq.Hz, t_start=${node.inputs.t_start.value}*pq.ms, t_stop=${node.inputs.t_stop.value}*pq.ms)`
      : "elephant.spike_train_generation.homogeneous_gamma_process(a={{ inputs.a.value }}, b={{ inputs.b.value }}*pq.Hz, t_start={{ inputs.t_start.value }}*pq.ms, t_stop={{ inputs.t_stop.value }}*pq.ms)",
});
