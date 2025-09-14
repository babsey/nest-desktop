// pandasDataFrame.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { dataframeType, IPandasDataFrame } from "./interfaceTypes";

export default defineCodeNode({
  type: "pandas.concat",
  title: "concat",
  inputs: {
    objs: () => new NodeInputInterface("objs"),
  },
  outputs: {
    out: () => new NodeOutputInterface<IPandasDataFrame>().use(setType, dataframeType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const objs = this.node.getConnectedNodeByInterface("objs");
    if (objs != undefined) args.push(`${objs.value}`);

    return `pd.concat([${args.join(", ")}])`;
  },
  variableName: "df",
});
