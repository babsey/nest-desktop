// numpyCorrelate.ts

import { SelectInterface, setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, stringType } from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.correlate",
  title: "correlate",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
    v: () => new NodeInputInterface<INumpyArray>("v").use(setType, arrayType),
    mode: () => new SelectInterface("mode", "valid", ["valid", "same", "full"]).use(setType, stringType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedNodeByInterface("a");
    if (a != undefined) args.push(`a=${a.value}`);

    const v = this.node.getConnectedNodeByInterface("v");
    if (v != undefined) args.push(`v=${v.value}`);

    const mode = this.node.getConnectedNodeByInterface("mode");
    if (mode != undefined) args.push(`mode=${mode.value}`);
    else if (this.node.inputs.mode.value !== "valid") args.push(`mode=${this.node.inputs.mode.value}`);

    return `np.correlate(${args.join(", ")})`;
  },
  variableName: "corr",
});
