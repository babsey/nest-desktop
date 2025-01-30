// nestCreate.ts

import { IntegerInterface, NodeInterface, TextInputInterface, displayInSidebar, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { IParamProps } from "@/helpers/common/parameter";

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
  codeTemplate() {
    if (!this.node) return this.type;
    const args = ['"{{ inputs.model.value }}"'];
    if (this.node.inputs.size.value > 1) args.push("{{ inputs.size.value }}");

    if (this.node.networkItem) {
      const inputs = this.node.inputs;
      const params: string[] = [];
      this.node.networkItem.paramsVisible.forEach((paramKey: string) => {
        const param = inputs[paramKey];
        if (param) params.push(`"${paramKey}": ${param.value}`);
      });
      if (params.length > 0) args.push(`params={\n\t${params.join(",\n\t")}\n}`);
    }

    return `nest.Create(${args.join(", ")})`;
  },
  onPlaced() {
    if (!this.node) return;
    this.node.networkItem = this.node.code.project.network.nodes.nodeItems[this.node.indexOfNodeType];
  },
  onUpdate({ model }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (model.includes("recorder") || model.includes("meter")) outputs["events"] = () => new NodeOutputInterface();

    if (this.node?.networkItem && this.node?.networkItem.paramsVisible.length > 0) {
      this.node?.networkItem.filteredParams.forEach((param: IParamProps) => {
        inputs[param.id] = () =>
          new TextInputInterface(param.id, param.value as string).use(displayInSidebar, true).setHidden(true);
      });
    }

    return { inputs, outputs };
  },
});
