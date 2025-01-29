// norseSequentialState.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineDynamicCodeNode({
  type: "norse.torch.SequentialState",
  title: "sequential state",
  inputs: {
    nModules: () => new IntegerInterface("number of modules", 1).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: (node) => {
    if (!node) return "norse.torch.SequentialState()";
    const nodes = node.getConnectedNodes("inputs");
    if (node.inputs.nModules.value != nodes.length + 1) node.inputs.nModules.value = nodes.length + 1;
    if (nodes.length === 0) return "norse.torch.SequentialState()";
    const nodesCodeTemplates = nodes.map((node) => node.codeTemplate(node));
    return `s${node.indexOfNodeType + 1} = norse.torch.SequentialState(\n\t${nodesCodeTemplates.join(",\n\t")}\n)`;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    const nModules = this.inputs?.nModules.value ?? 1;
    for (let i = 0; i < nModules; i++) {
      inputs["module" + i + 1] = () => new NodeInterface(`module ${i + 1}`, "");
    }

    return { inputs, outputs };
  },
});
