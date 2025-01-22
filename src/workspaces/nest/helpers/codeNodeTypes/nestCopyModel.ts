// nestCopyModel.ts

import { setType, TextInputInterface } from "baklavajs";

import { stringType } from "@/helpers/codeNodeTypes/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.CopyModel",
  title: "Copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha").use(setType, stringType).setPort(false),
    new: () => new TextInputInterface("new", "new").use(setType, stringType).setPort(false),
  },
  codeTemplate: () => "nest.CopyModel",
});
