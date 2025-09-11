// nestPrepare.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { getPositionAtColumn } from "@/helpers/codeGraph/baseCodeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import nestPrepare from "./nestPrepare";

export default defineCodeNode({
  type: "nest.Prepare",
  title: "prepare",
  codeTemplate: () => "nest.Prepare()",
});

export const addNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return graph.addNodeAtCoordinates(nestPrepare, getPositionAtColumn(4, 100));
};

export const getNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest.Prepare");
  if (!codeNode) return addNESTPrepareNode(graph);
  return codeNode;
};

export const loadNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return getNESTPrepareNode(graph);
};
