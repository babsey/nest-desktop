// listComprehension.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "listComprehension",
  title: "list comprehension",
  inputs: {
    expression: () => new NodeInterface("expression", ""),
    list: () => new NodeInterface("list", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate() {
    if (!this.node) return "";
    const list = this.node.getConnectedNodeByInterface("list");
    if (!list) return "[]";
    const expression = this.node.getConnectedNodeByInterface("expression");
    if (!expression) return `[i for i in ${list.value}]`;
    return `[${expression.value} for i in ${list.value}]`;
  },
});
