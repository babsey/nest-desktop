// dict.ts

import { IntegerInterface, NodeInterface, TextInputInterface, displayInSidebar, setType } from "baklavajs";

import { NodeOutputInterface, defineDynamicCodeNode, formatLabels } from "@/codeGraph";
import { numberType } from "..";

export default defineDynamicCodeNode({
  type: "dict",
  title: "dict",
  inputs: {
    nArgs: () => new IntegerInterface("nArgs", 1).use(setType, numberType).setHidden(true),
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
    if (this.node.inputs.nArgs.value !== nodes.length + 1) this.node.inputs.nArgs.value = nodes.length + 1;

    const nArgs = this.inputs?.nArgs.value ?? 1;
    for (let i = 0; i < nArgs; i++) {
      const argId = "arg" + (i + 1);
      const args = this.node.getConnectedNodesByInterface(argId);
      if (args.length > 0) {
        keyword = this.node.inputs[argId].value;
        value = formatLabels(args).join(", ");
        kwargs.push(keyword ? `${keyword}=${value}` : `${value}`);
      }
    }

    return `dict(${kwargs.join(", ")})`;
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
