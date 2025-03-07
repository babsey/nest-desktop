// elephantHomogeneousGammaProcess.ts

import { CheckboxInterface, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { booleanType, numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  modules: ["quantities"],
  title: "homogeneous gamma process",
  inputs: {
    a: () => new IntegerInterface("a", 3).use(setType, numberType),
    b: () => new IntegerInterface("b", 10).use(setType, numberType),
    t_start: () => new NumberInterface("t_start", 0).use(setType, numberType),
    t_stop: () => new NumberInterface("t_stop", 1000).use(setType, numberType),
    nd_array: () => new CheckboxInterface("nd_array", false).use(setType, booleanType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    times: () => new NodeOutputInterface("times", ".times"),
    size: () => new NodeOutputInterface("size", ".size"),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedNodesByInterface("a");
    if (a.length > 0) args.push(`${this.code?.graph.formatLabels(a).join(", ")}`);
    else args.push(`${this.node.inputs.a.value}`);

    const b = this.node.getConnectedNodesByInterface("b");
    if (b.length > 0) args.push(`${this.code?.graph.formatLabels(b).join(", ")}*pq.Hz`);
    else args.push(`${this.node.inputs.b.value}*pq.Hz`);

    const t_start = this.node.getConnectedNodesByInterface("t_start");
    if (t_start.length > 0) args.push(`${this.code?.graph.formatLabels(t_start).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_start.value > 0) args.push(`${this.node.inputs.t_start.value}*pq.ms`);

    const t_stop = this.node.getConnectedNodesByInterface("t_stop");
    if (t_stop.length > 0) args.push(`${this.code?.graph.formatLabels(t_stop).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_stop.value !== 1000) args.push(`${this.node.inputs.t_stop.value}*pq.ms`);

    return `elephant.spike_train_generation.homogeneous_gamma_process(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "spiketrain",
});
