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
    const args = ['"{{ inputs.model.value }}"'];
    if (node.inputs.size.value > 1) args.push("{{ inputs.size.value }}");

    const nodes = node.getConnectedNodes("outputs");
    return (nodes.length > 0 ? `${node.label} = ` : "") + `nest.Create(${args.join(", ")})`;
  },
  onUpdate({ model }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (model.includes("recorder") || model.includes("meter"))
      outputs["events"] = () => new NodeInterface("events", "");

    return { inputs, outputs };
  },
});
