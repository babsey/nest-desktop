// text.ts

import { setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { stringType } from "./interfaceTypes";

export default defineCodeNode({
  type: "text",
  title: "text",
  inputs: {
    text: () => new TextInputInterface("text", "").setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface<string>().use(setType, stringType),
  },
  variableName: "t",
  codeTemplate: (node) => (node ? `"${node.inputs.text.value}"` : '"{{ inputs.text.value }}"'),
});
