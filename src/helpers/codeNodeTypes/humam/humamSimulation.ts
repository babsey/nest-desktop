// humamSimulation.ts

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "humam.Simulation",
  title: "simulation",
  variableName: "sim",
  inputs: {
    sim_dict: () => new NodeInputInterface("sim dict"),
    net_dict: () => new NodeInputInterface("net dict"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const simDict = this.node.getConnectedNodeByInterface("sim_dict");
    if (simDict != undefined) args.push(`${simDict.value}`);

    const netDict = this.node.getConnectedNodeByInterface("net_dict");
    if (netDict != undefined) args.push(`${netDict.value}`);

    return `humam.Simulation(${args.join(", ")})`;
  },
});
