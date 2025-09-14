// nestRandomLognormal.ts

import { displayInSidebar, NumberInterface } from "baklavajs";
import { AbstractCodeNode, NodeOutputInterface, defineCodeNode, getPositionAtColumn } from "@/codeGraph";

import { CodeGraph } from "@/helpers/code/codeGraph";

import nestRandomLognormal from "./nestRandomLognormal";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomLognormalProps {
  mean?: number;
  std?: number;
}

export default defineCodeNode({
  type: "nest.random.lognormal",
  title: "random log normal",
  variableName: "randlognorm",
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

    return `nest.random.lognormal(${args.join(", ")})`;
  },
});

export const addNESTRandomLognormal = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(nestRandomLognormal, getPositionAtColumn(-2, 900));
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomLognormal = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomLognormalProps,
): AbstractCodeNode => {
  const codeNode = addNESTRandomLognormal(graph);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
