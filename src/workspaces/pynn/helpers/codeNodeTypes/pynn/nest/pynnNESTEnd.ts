// pynnNESTEnd.ts

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.nest.end",
  modules: ["pyNN.nest"],
  title: "end",
  codeTemplate: () => "pyNN.nest.end()",
});
