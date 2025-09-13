// blank.ts

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "blank",
  title: "blank",
  codeTemplate: () => "",
});
