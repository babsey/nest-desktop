// pandasDataFrame.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";
import { IPandasDataFrame } from "./interfaceTypes";

export default defineCodeNode({
  type: "pandas.DataFrame",
  title: "data frame",
  inputs: {
    data: () => new NodeInputInterface("data"),
  },
  outputs: {
    out: () => new NodeOutputInterface<IPandasDataFrame>(),
  },
  codeTemplate: (node) => (node ? `pd.DataFrame(${node.inputs.data.value})` : "pd.DataFrame({{ inputs.data.value }})"),
});
