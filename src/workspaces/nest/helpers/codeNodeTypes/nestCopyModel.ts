// nestCopyModel.ts

import { setType, TextInputInterface } from "baklavajs";

import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.CopyModel",
  title: "copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha").use(setType, stringType),
    new: () => new TextInputInterface("new", "new").use(setType, stringType),
  },
  codeTemplate: () => "nest.CopyModel({{ inputs.existing.value }}, {{ inputs.new.value }})",
});
