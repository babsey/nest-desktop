// norseLIParameters.ts

import { displayInSidebar, NumberInterface, setType } from "baklavajs";
import { AbstractCodeNode, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { liParametersType } from "./interfaceTypes";

const getParam = (node: AbstractCodeNode, name: string): string => {
  const sourceNode = node.getConnectedNodeByInterface(name);
  if (sourceNode) {
    if (sourceNode.type !== "torch.tensor") return `${name}=torch.tensor(${sourceNode.value})`;
    else return `${name}=${sourceNode.value}`;
  } else return `${name}=torch.tensor(${node.inputs[name].value})`;
};

export default defineCodeNode({
  type: "norse.torch.LIParameters",
  modules: ["torch"],
  title: "LI Parameters",
  inputs: {
    tau_syn_inv: () => new NumberInterface("tau_syn_inv", 200).use(displayInSidebar, true).setHidden(true),
    tau_mem_inv: () => new NumberInterface("tau_mem_inv", 100).use(displayInSidebar, true).setHidden(true),
    v_leak: () => new NumberInterface("v_leak", 0).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface().use(setType, liParametersType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;
      args.push(getParam(this.node, paramKey));
    });

    return args.length > 0 ? `norse.torch.LIParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.LIParameters()";
  },
  variableName: "p",
});
