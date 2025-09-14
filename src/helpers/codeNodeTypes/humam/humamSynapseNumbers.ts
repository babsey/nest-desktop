// humamSynapseNumbers.ts

import { NumberInterface, TextInputInterface } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "humam.SynapseNumbers",
  title: "synapse numbers",
  variableName: "sn",
  inputs: {
    connectivity: () => new TextInputInterface("connectivity", ""),
    NN: () => new NodeInputInterface("NN"),
    conn_path: () => new TextInputInterface("conn path", ""),
    vol_path: () => new TextInputInterface("vol path", ""),
    FLN: () => new NumberInterface("FLN", 0),
    rho_syn: () => new NumberInterface("rho_syn", 0),
    Z_i: () => new NumberInterface("Z i", 0),
    SLN_FF: () => new NumberInterface("SLN FF", 0),
    SLN_FB: () => new NumberInterface("SLN FB", 0),
    lambda: () => new NumberInterface("lambda", 0),
    a0: () => new NumberInterface("a0", 0),
    a1: () => new NumberInterface("a1", 0),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const connectivity = this.node.getConnectedNodeByInterface("connectivity");
    if (connectivity != undefined) args.push(`${connectivity.value}`);
    else args.push(`${this.node.inputs.connectivity.value}`);

    const NN = this.node.getConnectedNodeByInterface("NN");
    if (NN != undefined) args.push(`${NN.value}`);

    const connPath = this.node.getConnectedNodeByInterface("conn_path");
    if (connPath != undefined) args.push(`${connPath.value}`);
    else args.push(`${this.node.inputs.conn_path.value}`);

    const volPath = this.node.getConnectedNodeByInterface("vol_path");
    if (volPath != undefined) args.push(`${volPath.value}`);
    else args.push(`${this.node.inputs.vol_path.value}`);

    const FLN = this.node.getConnectedNodeByInterface("FLN");
    if (FLN != undefined) args.push(`${FLN.value}`);
    else args.push(`${this.node.inputs.FLN.value}`);

    const rhoSyn = this.node.getConnectedNodeByInterface("rho_syn");
    if (rhoSyn != undefined) args.push(`${rhoSyn.value}`);
    else args.push(`${this.node.inputs.rho_syn.value}`);

    const ZI = this.node.getConnectedNodeByInterface("Z_i");
    if (ZI != undefined) args.push(`${ZI.value}`);
    else args.push(`${this.node.inputs.Z_i.value}`);

    const SLN_FF = this.node.getConnectedNodeByInterface("SLN_FF");
    if (SLN_FF != undefined) args.push(`${SLN_FF.value}`);
    else args.push(`${this.node.inputs.SLN_FF.value}`);

    const SLN_FB = this.node.getConnectedNodeByInterface("SLN_FB");
    if (SLN_FB != undefined) args.push(`${SLN_FB.value}`);
    else args.push(`${this.node.inputs.SLN_FB.value}`);

    const lambda = this.node.getConnectedNodeByInterface("lambda");
    if (lambda != undefined) args.push(`${lambda.value}`);
    else args.push(`${this.node.inputs.lambda.value}`);

    const a0 = this.node.getConnectedNodeByInterface("a0");
    if (a0 != undefined) args.push(`${a0.value}`);
    else args.push(`${this.node.inputs.a0.value}`);

    const a1 = this.node.getConnectedNodeByInterface("a1");
    if (a1 != undefined) args.push(`${a1.value}`);
    else args.push(`${this.node.inputs.a1.value}`);

    return `humam.SynapseNumbers(${args.join(", ")})`;
  },
});
