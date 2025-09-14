// nestRandomNormal.ts

import { displayInSidebar, NumberInterface } from "baklavajs";
import { AbstractCodeNode, NodeOutputInterface, defineCodeNode, getPositionAtColumn } from "@/codeGraph";

import { CodeGraph } from "@/helpers/code/codeGraph";

import nestRandomNormal from "./nestRandomNormal";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomNormalProps {
  mean?: number;
  std?: number;
}

export default defineCodeNode({
  type: "nest.random.normal",
  title: "random normal",
  variableName: "randnorm",
  inputs: {
    mean: () => new NumberInterface("mean", 0).use(displayInSidebar, true).setHidden(true),
    std: () => new NumberInterface("std", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const mean = this.node.getConnectedNodeByInterface("mean");
    if (mean != undefined) args.push(`${mean.value}`);
    else if (!this.node.inputs.mean.hidden) args.push(`${this.node.inputs.mean.value}`);

    keyword = args.length < 1 ? "std=" : "";
    const std = this.node.getConnectedNodeByInterface("std");
    if (std != undefined) args.push(`${keyword}${std.value}`);
    else if (!this.node.inputs.std.hidden) args.push(`${keyword}${this.node.inputs.std.value}`);

    return `nest.random.normal(${args.join(", ")})`;
  },
});

export const addNESTRandomNormal = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(nestRandomNormal, getPositionAtColumn(-2, 900));
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomNormal = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomNormalProps,
): AbstractCodeNode => {
  const codeNode = addNESTRandomNormal(graph);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
