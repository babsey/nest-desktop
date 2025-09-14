// numpyArgwhere.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.argwhere",
  title: "argwhere",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedNodeByInterface("a");
    if (a != undefined) args.push(`${a.value}`);

    return `np.argwhere(${args.join(", ")})`;
  },
});
