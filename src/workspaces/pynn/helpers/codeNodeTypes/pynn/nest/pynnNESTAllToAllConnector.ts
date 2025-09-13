// pynnNESTAllToAllConnector.ts

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.nest.AllToAllConnector",
  modules: ["pyNN.nest"],
  title: "all to all connector",
  codeTemplate: () => "pyNN.nest.AllToAllConnector()",
});
