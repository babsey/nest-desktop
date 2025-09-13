// brainscales2AllToAllConnector.ts

import { defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.AllToAllConnector",
  title: "all to all connector",
  codeTemplate: () => "pynn.AllToAllConnector()",
});
