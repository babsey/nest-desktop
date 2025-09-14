// brainscales2Setup.ts

import { displayInSidebar, NumberInterface, setType } from "baklavajs";
import { defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.setup",
  title: "setup",
  inputs: {
    timestep: () => new NumberInterface("timestep", 0.000034).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const timestep = this.node.getConnectedNodeByInterface("timestep");
    if (timestep != undefined) args.push(`${timestep.value}`);
    else if (this.node.inputs.timestep.value > 0.000034) args.push(`${this.node.inputs.timestep.value}`);

    return `pynn.setup(${args.join(", ")})`;
  },
});
