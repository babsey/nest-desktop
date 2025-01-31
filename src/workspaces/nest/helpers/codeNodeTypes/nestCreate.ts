// nestCreate.ts

import { IntegerInterface, NodeInterface, TextInputInterface, displayInSidebar, setType } from "baklavajs";

import { IParamProps } from "@/helpers/common/parameter";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "create node",
  variableName: "node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType),
    size: () => new IntegerInterface("size", 1, 1).use(setType, numberType).use(displayInSidebar, true),
    params: () => new NodeInputInterface("params"),
    positions: () => new NodeInputInterface("positions", true),
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

    const positions = this.node.getConnectedNodesByInterface("positions");
    if (positions.length > 0) {
      const inputPositions = this.node.inputs?.positions as NodeInputInterface;
      if (inputPositions.integrated) {
        args.push(`positions=${positions[0].codeTemplate}`);
      } else {
        args.push(`positions=${positions[0].label}`);
      }
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
