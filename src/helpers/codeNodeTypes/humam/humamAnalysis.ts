// humamAnalysis.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "humam.Analysis",
  title: "analysis",
  variableName: "ana",
  inputs: {
    ana_params: () => new NodeInputInterface("params"),
    net_dict: () => new NodeInputInterface("net dict"),
    sim_dict: () => new NodeInputInterface("sim dict"),
    sim_folder: () => new TextInputInterface("sim folder", ""),
    base_path: () => new TextInputInterface("base path", ""),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const anaParams = this.node.getConnectedNodeByInterface("ana_params");
    if (anaParams != undefined) args.push(`${anaParams.value}`);

    const netDict = this.node.getConnectedNodeByInterface("net_dict");
    if (netDict != undefined) args.push(`${netDict.value}`);

    const simDict = this.node.getConnectedNodeByInterface("sim_dict");
    if (simDict != undefined) args.push(`${simDict.value}`);

    const simFolder = this.node.getConnectedNodeByInterface("sim_folder");
    if (simFolder != undefined) args.push(`${simFolder.value}`);
    else args.push(`"${this.node.inputs.sim_folder.value}"`);

    const basePath = this.node.getConnectedNodeByInterface("base_path");
    if (basePath != undefined) args.push(`${basePath.value}`);
    else args.push(`"${this.node.inputs.base_path.value}"`);

    return `humam.Analysis(${args.join(", ")})`;
  },
});
