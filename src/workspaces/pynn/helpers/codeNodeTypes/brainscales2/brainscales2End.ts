// brainscales2End.ts

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.end",
  title: "end",
  codeTemplate: () => "pynn.end()",
});
