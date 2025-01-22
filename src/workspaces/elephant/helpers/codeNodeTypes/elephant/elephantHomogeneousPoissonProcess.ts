// elephantHomogeneousPoissonProcess.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_poisson_process",
  modules: ["quantities"],
  title: "homogeneous Poisson process",
  inputs: {
    rate: () => new IntegerInterface("rate", 10).use(setType, numberType),
    t_start: () => new IntegerInterface("t_start", 0).use(setType, numberType),
    t_stop: () => new IntegerInterface("t_stop", 1000).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    times: () => new NodeOutputInterface("times", ".times"),
    size: () => new NodeOutputInterface("size", ".size"),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const rate = this.node.getConnectedNodesByInterface("rate");
    if (rate.length > 0) args.push(`${this.code?.graph.formatLabels(rate).join(", ")}*pq.Hz`);
    else args.push(`${this.node.inputs.rate.value}*pq.Hz`);

    const t_start = this.node.getConnectedNodesByInterface("t_start");
    if (t_start.length > 0) args.push(`${this.code?.graph.formatLabels(t_start).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_start.value > 0) args.push(`${this.node.inputs.t_start.value}*pq.ms`);

    const t_stop = this.node.getConnectedNodesByInterface("t_stop");
    if (t_stop.length > 0) args.push(`${this.code?.graph.formatLabels(t_stop).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_stop.value !== 1000) args.push(`${this.node.inputs.t_stop.value}*pq.ms`);

    return `elephant.spike_train_generation.homogeneous_poisson_process(${args.join(", ")})`;
  },

  onCreate() {
    this.twoColumn = true;
  },
  variableName: "spiketrain",
});
