// comment.ts

import { setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/codeGraph";

import { stringType } from "..";

export default defineCodeNode({
  type: "comment",
  title: "comment",
  inputs: {
    text: () => new TextInputInterface("text", "").use(setType, stringType).setPort(false),
  },
  codeTemplate() {
    if (!this.node) return "# {{ inputs.text.value }}";
    return `# ${this.node.inputs.text.value}`;
  },
});
