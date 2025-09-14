// norseLI.ts

import { CheckboxInterface, displayInSidebar, setType } from "baklavajs";
import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { liParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LI",
  title: "LI",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, liParametersType).use(displayInSidebar, true).setHidden(true),
    record_states: () =>
      new CheckboxInterface("record_states", false).setPort(false).use(displayInSidebar, true).setHidden(true),
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

    return `norse.torch.LI(${args.join(", ")})`;
  },
  variableName: "model",
});
