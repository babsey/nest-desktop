// text.ts

import { setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { numberType } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "list",
  title: "list",
  inputs: {
    input: () => new NodeInputInterface(),
  },
  outputs: {
    out: () => new NodeOutputInterface<number>().use(setType, numberType),
  },
  variableName: "n",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const input = this.node.getConnectedNodesByInterface("input");
    if (input.length > 0) args.push(`${this.code?.graph.formatLabels(input).join(", ")}`);

    return `list(${args.join(", ")})`;
  },
});
