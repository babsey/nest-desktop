// list.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabels } from "@/codeGraph";

export default defineCodeNode({
  type: "list",
  title: "list",
  inputs: {
    iterable: () => new NodeInputInterface("iterable"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "n",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const iterable = this.node.getConnectedOutputInterfacesByInterface("iterable");
    if (iterable.length > 1) args.push(`(${formatInterfaceLabels(iterable, false).join(", ")})`);
    else if (iterable.length > 0) args.push(`${formatInterfaceLabels(iterable, false).join(", ")}`);

    return `list(${args.join(", ")})`;
  },
});
