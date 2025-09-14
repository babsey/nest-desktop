// pandasDataFrame.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode } from "@/codeGraph";

import { dataframeType, IPandasDataFrame } from "./interfaceTypes";

export default defineCodeNode({
  type: "pandas.DataFrame",
  title: "data frame",
  inputs: {
    data: () => new NodeInputInterface("data"),
  },
  outputs: {
    out: () => new NodeOutputInterface<IPandasDataFrame>().use(setType, dataframeType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const data = this.node.getConnectedNodeByInterface("data");
    if (data != undefined) args.push(`${data.value}`);

    return `pd.DataFrame(${args.join(", ")})`;
  },
  variableName: "df",
});
