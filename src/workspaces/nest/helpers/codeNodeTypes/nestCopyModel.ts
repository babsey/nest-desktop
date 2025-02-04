// nestCopyModel.ts

import { setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "nest.CopyModel",
  title: "copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha").use(setType, stringType),
    new: () => new TextInputInterface("new", "new").use(setType, stringType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.CopyModel(${this.node.inputs.existing.value}, ${this.node.inputs.new.value})`;
  },
});
