// nestInstall.ts

import { displayInSidebar, TextInputInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.Install",
  title: "install",
  inputs: {
    module_name: () =>
      new TextInputInterface("module name", "nestmlmodule").use(setType, stringType).use(displayInSidebar, true),
  },
  codeTemplate: (node) =>
    node ? `nest.Install("${node.inputs.module_name.value}")` : 'nest.Install("{{ inputs.module_name.value }}")',
});
