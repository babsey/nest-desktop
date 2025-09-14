// humamNetwork.ts

import { displayInSidebar } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "humam.Network",
  title: "network",
  variableName: "net",
  inputs: {
    NN: () => new NodeInputInterface("neuron numbers"),
    SN: () => new NodeInputInterface("synapse numbers"),
    params: () => new NodeInputInterface("params").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const nn = this.node.getConnectedNodeByInterface("NN");
    if (nn != undefined) args.push(`${nn.value}`);

    const sn = this.node.getConnectedNodeByInterface("SN");
    if (sn != undefined) args.push(`${sn.value}`);

    const params = this.node.getConnectedNodeByInterface("params");
    if (params != undefined) args.push(`${params.value}`);

    return `humam.Network(${args.join(", ")})`;
  },
});
