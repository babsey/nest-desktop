// nestCreate.ts

import { displayInSidebar, IntegerInterface, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/interfaceTypes";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "Create node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType).setPort(false),
    size: () => new IntegerInterface("Size", 1, 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    node_collection: () =>
      new NodeInterface<INESTNodeCollection>("node collection", "").use(setType, nestNodeCollectionType),
  },
  codeTemplate: (node) => {
    if (!node) return "";
    return `${node.label} = nest.Create("{{ inputs.model.value }}", {{ inputs.size.value }})`;
  },
  onUpdate({ model }) {
    if (model.includes("recorder") || model.includes("meter")) {
      return {
        outputs: {
          events: () => new NodeInterface("events", ""),
        },
      };
    } else {
      return {};
    }
  },
});
