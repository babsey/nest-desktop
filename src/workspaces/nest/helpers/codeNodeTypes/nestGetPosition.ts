// nestGetPosition.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";

export default defineCodeNode({
  type: "nest.GetPosition",
  title: "get position",
  inputs: {
    node: () => new NodeInputInterface<INESTNodeCollection>("node").use(setType, nestNodeCollectionType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "pos",
  codeTemplate: () => "nest.GetPosition({{ inputs.node.value }})",
});
