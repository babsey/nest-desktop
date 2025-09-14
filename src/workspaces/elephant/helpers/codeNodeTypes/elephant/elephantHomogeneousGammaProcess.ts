// elephantHomogeneousGammaProcess.ts

import { CheckboxInterface, displayInSidebar, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface, defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  modules: ["quantities"],
  title: "homogeneous gamma process",
  inputs: {
    a: () => new IntegerInterface("a", 3).use(setType, numberType),
    b: () => new IntegerInterface("b", 10).use(setType, numberType),
    t_start: () =>
      new NumberInterface("t_start", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    t_stop: () =>
      new NumberInterface("t_stop", 1000).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    nd_array: () =>
      new CheckboxInterface("nd_array", false).use(setType, booleanType).use(displayInSidebar, true).setHidden(true),
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

    const a = this.node.getConnectedNodeByInterface("a");
    if (a != undefined) args.push(`${a.value}`);
    else args.push(`${this.node.inputs.a.value}`);

    const b = this.node.getConnectedNodeByInterface("b");
    if (b != undefined) args.push(`${b.value}*pq.Hz`);
    else args.push(`${this.node.inputs.b.value}*pq.Hz`);

    const t_start = this.node.getConnectedNodeByInterface("t_start");
    if (t_start != undefined) args.push(`${t_start.value}*pq.ms`);
    else if (this.node.inputs.t_start.value > 0) args.push(`${this.node.inputs.t_start.value}*pq.ms`);

    keyword = args.length < 2 ? "t_stop=" : "";
    const t_stop = this.node.getConnectedNodeByInterface("t_stop");
    if (t_stop != undefined) args.push(`${keyword}${t_stop.value}*pq.ms`);
    else if (this.node.inputs.t_stop.value !== 1000) args.push(`${keyword}${this.node.inputs.t_stop.value}*pq.ms`);

    return `elephant.spike_train_generation.homogeneous_gamma_process(${args.join(", ")})`;
  },
  variableName: "spiketrain",
});
