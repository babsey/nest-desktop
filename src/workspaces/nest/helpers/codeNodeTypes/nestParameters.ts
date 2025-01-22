// nestParameters.ts

import { NodeInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import { INESTNodeCollection } from "./interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest/Parameters",
  title: "parameters",
  variableName: "p",
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const params: string[] = [];

    if (this.inputs) {
      Object.entries(this.inputs).forEach((input) => {
        params.push(`"${input[0]}": ${input[1].value}`);
      });
    }

    if (params.length > 0) return `{\n\t${params.join(",\n\t")}\n}`;
    else return "";
  },
  onCreate() {
    this.twoColumn = true;
    this.state.role = "network";
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.nodes.nodeItems[this.indexOfNodeType];
    if (!this.networkItem) return;
    this.networkItem.codeNode = this;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    // if (this.node && this.node.networkItem) {
    //   const networkNode = this.node.networkNode as TNode;

    //   networkNode.paramsAll.forEach((param: IParamProps) => {
    //     inputs[param.id] = () =>
    //       new TextInputInterface(param.id, param.value as string)
    //         .use(displayInSidebar, true)
    //         .setHidden(!networkNode.paramsVisible.includes(param.id));
    //   });
    // }

    return { inputs, outputs };
  },
});
