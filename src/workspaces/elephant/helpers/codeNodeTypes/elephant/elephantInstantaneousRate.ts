// elephantInstantaneousRate.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.statistics.instantaneous_rate",
  title: "instantaneous rate",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    sampling_period: () => new IntegerInterface("sampling period", 0).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "elephant.statistics.instantaneous_rate()",
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "ir",
});
