// nestResetKernel.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { getPositionAtColumn } from "@/helpers/codeGraph/baseCodeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestResetKernel from "./nestResetKernel";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export default defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
  codeTemplate: () => "nest.ResetKernel()",
});

export const addNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return graph.addNodeAtCoordinates(nestResetKernel, getPositionAtColumn(-2, 100));
};

export const getNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest.ResetKernel");
  if (!codeNode) return addNESTResetKernelNode(graph);
  return codeNode;
};

export const loadNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return getNESTResetKernelNode(graph);
};
