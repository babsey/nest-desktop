// numpyConvolve.ts

import { SelectInterface, setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel, stringType } from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.convolve",
  title: "convolve",
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

    const a = this.node.getConnectedOutputInterfaceByInterface("a");
    if (a != undefined) args.push(`a=${formatInterfaceLabel(a)}`);

    const v = this.node.getConnectedOutputInterfaceByInterface("v");
    if (v != undefined) args.push(`v=${formatInterfaceLabel(v)}`);

    const mode = this.node.getConnectedOutputInterfaceByInterface("mode");
    if (mode != undefined) args.push(`mode=${formatInterfaceLabel(mode)}`);
    else if (this.node.inputs.mode.value !== "valid") args.push(`mode=${this.node.inputs.mode.value}`);

    return `np.convolve(${args.join(", ")})`;
  },
  variableName: "conv",
});
