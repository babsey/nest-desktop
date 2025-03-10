// text.ts

import { setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { stringType } from "./interfaceTypes";

export default defineCodeNode({
  type: "text",
  title: "text",
  inputs: {
    text: () => new TextInputInterface("text", "").use(setType, stringType).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface<string>().use(setType, stringType),
  },
  codeTemplate() {
    if (!this.node) return "{{ inputs.text.value }}";
    return `"${this.node.inputs.text.value}"`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  variableName: "t",
});
