// elephantHomogeneousPoissonProcess.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_poisson_process",
  title: "homogeneous Poisson process",
  inputs: {
    rate: () => new IntegerInterface("rate", 10).use(setType, numberType),
    t_start: () => new IntegerInterface("t_start", 0).use(setType, numberType),
    t_stop: () => new IntegerInterface("t_stop", 10000).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "st_pp",
  codeTemplate: (node) =>
    node
      ? `elephant.spike_train_generation.homogeneous_poisson_process(rate=${node.inputs.rate.value}*pq.Hz, t_start=${node.inputs.t_start.value}*pq.ms, t_stop=${node.inputs.t_stop.value}*pq.ms)`
      : "elephant.spike_train_generation.homogeneous_poisson_process(rate={{ inputs.rate.value }}*pq.Hz, t_start={{ inputs.t_start.value }}*pq.ms, t_stop={{ inputs.t_stop.value }}*pq.ms)",
});
