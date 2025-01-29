// listComprehension.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

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
  codeTemplate: (node) => {
    if (!node) return "[]";
    const expressions = node?.getConnectedNodesByInterface("expression");
    const lists = node?.getConnectedNodesByInterface("list");
    if (lists.length > 0) {
      if (expressions.length === 0) return `[i for i in ${lists[0].codeTemplate(lists[0])}]`;
      return `[${expressions[0].codeTemplate(expressions[0])} for i in ${lists[0].codeTemplate(lists[0])}]`;
    }
    return "[]";
  },
});
