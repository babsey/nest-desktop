// zip.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

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

    const input = this.node.getConnectedOutputInterfaceByInterface("iterables");
    if (input) args.push(`${formatInterfaceLabel(input)}`);

    return `zip(${args.join(", ")})`;
  },
});
