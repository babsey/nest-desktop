// pandasDataFrame.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInterface } from "baklavajs";

export default defineCodeNode({
  type: "pandas.DataFrame",
  title: "Data Frame",
  inputs: {
    data: () => new NodeInterface("data", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "pd.DataFrame({{ inputs.data.value }})",
});
