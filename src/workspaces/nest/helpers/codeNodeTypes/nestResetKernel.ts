// nestResetKernel.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
  onCreate() {
    this.state.role = "resetKernel";
  },
  codeTemplate: () => "nest.ResetKernel()",
});
