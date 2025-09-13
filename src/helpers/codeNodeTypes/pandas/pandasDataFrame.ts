// pandasDataFrame.ts

import { setType } from "baklavajs";

import { NodeInputInterface, NodeOutputInterface, defineCodeNode, formatInterfaceLabel } from "@/codeGraph";

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

    const data = this.node.getConnectedOutputInterfaceByInterface("data");
    if (data != undefined) args.push(`${formatInterfaceLabel(data)}`);

    return `pd.DataFrame(${args.join(", ")})`;
  },
  variableName: "df",
});
