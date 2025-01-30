// dict.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { CodeNodeInterface } from "@/helpers/codeGraph/codeNodeInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "dict",
  title: "dict",
  inputs: {
    a: () => new CodeNodeInterface("a", ""),
    v: () => new CodeNodeInterface("v", ""),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "dict({{ inputs.a.value }}, {{ inputs.v.value }})",
});
