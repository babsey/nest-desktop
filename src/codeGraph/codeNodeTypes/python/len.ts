// text.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

import { numberType } from "..";

export default defineCodeNode({
  type: "len",
  title: "len",
  inputs: {
    list: () => new NodeInputInterface("list"),
  },
  outputs: {
    out: () => new NodeOutputInterface<number>().use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const list = this.node.getConnectedOutputInterfaceByInterface("list");
    if (list != undefined) args.push(`${formatInterfaceLabel(list)}`);

    return `len(${args.join(", ")})`;
  },
  variableName: "n",
});
