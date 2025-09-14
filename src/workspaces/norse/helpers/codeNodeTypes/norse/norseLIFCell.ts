// norseLIFCell.ts

import { CheckboxInterface, displayInSidebar, setType } from "baklavajs";
import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { lifParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIFCell",
  title: "LIF cell",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, lifParametersType).use(displayInSidebar, true).setHidden(true),
    record_states: () => new CheckboxInterface("record_states", false).use(displayInSidebar, true).setHidden(true),
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

    return `norse.torch.LIFCell(${args.join(", ")})`;
  },
  variableName: "model",
});
