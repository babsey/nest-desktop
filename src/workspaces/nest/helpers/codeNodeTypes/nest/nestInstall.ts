// nestInstall.ts

import { displayInSidebar, setType, TextInputInterface } from "baklavajs";
import { AbstractCodeNode, defineCodeNode, getPositionAtColumn, stringType } from "@/codeGraph";

import { CodeGraph } from "@/helpers/code/codeGraph";

import nestInstall from "./nestInstall";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export default defineCodeNode({
  type: "nest.Install",
  title: "install",
  inputs: {
    module_name: () =>
      new TextInputInterface("module name", "nestmlmodule").use(setType, stringType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.Install("${this.node.inputs.module_name.value}")`;
  },
});

export const addNESTInstallNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Install").length;
  const codeNode = graph.addNodeAtCoordinates(nestInstall, getPositionAtColumn(-2, 500 + 290 * idx));
  if (idx === 0) codeNode.state.comments = "Install modules";
  return codeNode;
};

export const loadNESTInstallNodes = (graph: CodeGraph | NESTCodeGraph, modulesProps: string[]): AbstractCodeNode[] => {
  const codeNodes = graph.nodes.filter((codeNode: AbstractCodeNode) => codeNode.type === "nest.Install");

  if (modulesProps.length === 0) {
    codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.remove());
    return [];
  }

  modulesProps.forEach((moduleProps: string, idx: number) => {
    const codeNode = codeNodes[idx] ?? addNESTInstallNode(graph);
    codeNode.inputs.module_name.value = moduleProps;
  });

  return codeNodes;
};
