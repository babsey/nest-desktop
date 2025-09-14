// elephantCV.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "elephant.statistics.cv",
  title: "coefficient of variation",
  inputs: {
    a: () => new NodeInputInterface("a"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedNodeByInterface("a");
    if (a != undefined) args.push(`${a.value}`);

    return `elephant.statistics.cv(${args.join(", ")})`;
  },
  variableName: "variation",
});
