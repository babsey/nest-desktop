// dict.ts

import { displayInSidebar, IntegerInterface, NodeInterface, TextInputInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

export default defineDynamicCodeNode({
  type: "dict",
  title: "dict",
  inputs: {
    nArgs: () => new IntegerInterface("nArgs", 1).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const kwargs: string[] = [];
    let keyword: string;
    let value: string | undefined;

    const nodes = this.node.getConnectedNodes("inputs");
    if (this.node.inputs.nArgs.value != nodes.length + 1) this.node.inputs.nArgs.value = nodes.length + 1;

    const nArgs = this.inputs?.nArgs.value ?? 1;
    for (let i = 0; i < nArgs; i++) {
      const argId = "arg" + (i + 1);
      const args = this.node.getConnectedNodesByInterface(argId);
      if (args.length > 0) {
        keyword = this.node.inputs[argId].value;
        value = this.code?.graph.formatLabels(args).join(", ");
        kwargs.push(keyword ? `${keyword}=${value}` : `${value}`);
      }
    }

    return `dict(${kwargs.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    const nArgs = this.inputs?.nArgs.value ?? 1;
    for (let i = 0; i < nArgs; i++) {
      inputs["arg" + (i + 1)] = () => new TextInputInterface(`arg ${i + 1}`, "").use(displayInSidebar, true);
    }

    return { inputs, outputs };
  },
});
