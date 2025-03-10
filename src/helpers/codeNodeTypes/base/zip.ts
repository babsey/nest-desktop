// zip.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "zip",
  title: "zip",
  inputs: {
    iterables: () => new NodeInputInterface(),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "z",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const input = this.node.getConnectedNodesByInterface("iterables");
    if (input.length > 0) args.push(`${this.code?.graph.formatLabels(input).join(", ")}`);

    return `zip(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
});
