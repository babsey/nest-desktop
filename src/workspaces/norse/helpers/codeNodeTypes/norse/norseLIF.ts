// norseLIF.ts

import { CheckboxInterface, displayInSidebar, setType } from "baklavajs";
import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { lifParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIF",
  title: "LIF",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, lifParametersType).use(displayInSidebar, true).setHidden(true),
    record_states: () =>
      new CheckboxInterface("record_states", false).setPort(false).use(displayInSidebar, true).setHidden(true),
    // input: () => new NodeInputInterface("input"),
    // state: () => new NodeInputInterface("state"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const p = this.node.getConnectedNodeByInterface("p");
    if (p != undefined) args.push(`p=${p.value}`);

    if (this.node.inputs.record_states.value) args.push(`record_states=True`);

    return `norse.torch.LIF(${args.join(", ")})`;
  },
  variableName: "model",
});
