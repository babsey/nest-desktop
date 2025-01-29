// plotlyFigureAddTrace.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.fig.add_trace",
  title: "add trace",
  inputs: {
    trace: () => new NodeInputInterface("trace"),
  },
  codeTemplate: () => "fig.add_trace({{ inputs.trace.value }})",
});
