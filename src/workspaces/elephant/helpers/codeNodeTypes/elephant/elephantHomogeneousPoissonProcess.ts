// elephantHomogeneousPoissonProcess.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, formatLabels, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_poisson_process",
  modules: ["quantities"],
  title: "homogeneous Poisson process",
  inputs: {
    rate: () => new IntegerInterface("rate", 10).use(setType, numberType),
    t_start: () =>
      new IntegerInterface("t_start", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    t_stop: () =>
      new IntegerInterface("t_stop", 1000).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    times: () => new NodeOutputInterface("times", ".times"),
    size: () => new NodeOutputInterface("size", ".size"),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const rate = this.node.getConnectedNodeByInterface("rate");
    if (rate != undefined) args.push(`${rate.value}*pq.Hz`);
    else args.push(`${this.node.inputs.rate.value}*pq.Hz`);

    const t_start = this.node.getConnectedNodesByInterface("t_start");
    if (t_start != undefined) args.push(`${formatLabels(t_start)}*pq.ms`);
    else if (this.node.inputs.t_start.value > 0) args.push(`${this.node.inputs.t_start.value}*pq.ms`);

    keyword = args.length < 2 ? "t_stop=" : "";
    const t_stop = this.node.getConnectedNodesByInterface("t_stop");
    if (t_stop != undefined) args.push(`${keyword}${formatLabels(t_stop)}*pq.ms`);
    else if (this.node.inputs.t_stop.value !== 1000) args.push(`${keyword}${this.node.inputs.t_stop.value}*pq.ms`);

    return `elephant.spike_train_generation.homogeneous_poisson_process(${args.join(", ")})`;
  },
  variableName: "spiketrain",
});
