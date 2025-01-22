// nestResetKernel.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
  onCreate() {
    this.state.position = "top";
  },
  codeTemplate: () => "nest.ResetKernel()",
});
