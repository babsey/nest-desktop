// norseSequentialState.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

export default defineDynamicCodeNode({
  type: "norse.torch.SequentialState",
  title: "Sequential state",
  inputs: {
    nModules: () => new IntegerInterface("number of modules", 1),
  },
  outputs: {
    model: () => new NodeInterface("model", ""),
  },
  codeTemplate: (node) => {
    if (!node) return "norse.torch.SequentialState";
    const nodes = node.getConnectedNodes("inputs");
    if (nodes.length === 0) return "norse.torch.SequentialState";
    const nodesCodeTemplates = nodes.map((node) => {
      node.renderCode();
      return node.script;
    });
    return `s${node.indexOfNodeType + 1} = norse.torch.SequentialState(\n\t${nodesCodeTemplates.join(",\n\t")}\n)`;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    // @ts-expect-error Property 'value' does not exist on type 'NodeInterfaceFactory<number>'.
    const nModules = this.inputs?.nModules.value || 1;
    for (let i = 0; i < nModules; i++) {
      inputs["module" + i + 1] = () => new NodeInterface(`module ${i + 1}`, "");
    }

    return { inputs, outputs };
  },
});
