// nestCreate.ts

import { IntegerInterface, NodeInterface, TextInputInterface, displayInSidebar, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { NodeParameter } from "@/helpers/node/nodeParameter";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "create node",
  variableName: "node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType),
    size: () => new IntegerInterface("size", 1, 1).use(setType, numberType).use(displayInSidebar, true),
    // params: () => new NodeInterface("params", null),
    // positions: () => new NodeInterface("positions", null),
  },
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>().use(setType, nestNodeCollectionType),
  },
  codeTemplate: (node) => {
    if (!node) return "nest.Create()";
    const args = ['"{{ inputs.model.value }}"'];
    if (node.inputs.size.value > 1) args.push("{{ inputs.size.value }}");

    const params: string[] = [];
    node.networkItem?.paramsVisible.forEach((paramKey: string) => {
      const param = node.inputs[paramKey];
      if (param) params.push(`"${paramKey}": ${param.value}`);
    });

    if (params.length > 0) args.push(`params={\n\t${params.join(",\n\t")}\n}`);

    return `nest.Create(${args.join(", ")})`;
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.nodes.nodeItems[this.indexOfNodeType];
  },
  onUpdate({ model }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (model.includes("recorder") || model.includes("meter"))
      outputs["events"] = () => new NodeInterface("events", "");

    if (this.networkItem && this.networkItem.paramsVisible.length > 0) {
      this.networkItem.filteredParams.forEach((param: NodeParameter) => {
        inputs[param.id] = () =>
          new TextInputInterface(param.id, param.value).use(displayInSidebar, true).setHidden(true);
      });
    }

    return { inputs, outputs };
  },
});
