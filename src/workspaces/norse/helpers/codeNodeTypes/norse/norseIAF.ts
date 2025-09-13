// norseIAF.ts

import { CheckboxInterface, displayInSidebar, setType } from "baklavajs";
import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

import { iafParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.IAF",
  title: "IAF",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, iafParametersType).use(displayInSidebar, true).setHidden(true),
    record_states: () =>
      new CheckboxInterface("record_states", false).setPort(false).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const p = this.node.getConnectedOutputInterfaceByInterface("p");
    if (p != undefined) args.push(`p=${formatInterfaceLabel(p)}`);

    if (this.node.inputs.record_states.value) args.push(`record_states=True`);

    return `norse.torch.IAF(${args.join(", ")})`;
  },
  variableName: "model",
});
