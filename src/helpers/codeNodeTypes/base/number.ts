// variable.ts

import { IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { numberType } from "./interfaceTypes";

export default defineCodeNode({
  type: "number",
  title: "number",
  inputs: {
    number: () => new IntegerInterface("number", 0).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface<number>().use(setType, numberType),
  },
  variableName: "n",
  codeTemplate: (node) => (node ? `${node.inputs.number.value}` : "{{ inputs.number.value }}"),
});
