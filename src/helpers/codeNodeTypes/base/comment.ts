// comment.ts

import { setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "./interfaceTypes";

export default defineCodeNode({
  type: "comment",
  title: "comment",
  inputs: {
    text: () => new TextInputInterface("text", "").use(setType, stringType).setPort(false),
  },
  codeTemplate: () => "# {{ inputs.text.value }}",
});
