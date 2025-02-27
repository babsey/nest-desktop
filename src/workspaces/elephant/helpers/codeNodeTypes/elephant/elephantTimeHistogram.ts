// elephantTimeHistogram.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.statistics.time_histogram",
  title: "time histogram",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    binsize: () => new IntegerInterface("binsize", 50).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "ts_hist",
  codeTemplate: () => "elephant.statistics.time_histogram({{ inputs.spiketrains.value }})",
});
