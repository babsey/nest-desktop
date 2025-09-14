// plotlyFigureAddTrace.ts

import { IntegerInterface } from "baklavajs";

import { NodeInputInterface, defineCodeNode } from "@/codeGraph";

export default defineCodeNode({
  type: "plotly.fig.add_trace",
  title: "add trace",
  inputs: {
    fig: () => new NodeInputInterface("fig"),
    trace: () => new NodeInputInterface("trace"),
    row: () => new IntegerInterface("row", 1),
    col: () => new IntegerInterface("col", 1),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const fig = this.node.getConnectedNodeByInterface("fig");
    if (fig != undefined) return this.type;
    const figname = fig.value;

    const trace = this.node.getConnectedNodeByInterface("trace");
    if (trace != undefined) args.push(`${trace.value}`);

    const row = this.node.getConnectedNodeByInterface("row");
    if (row != undefined) args.push(`row=${row.value}`);
    else args.push(`row=${this.node.inputs.row.value}`);

    const col = this.node.getConnectedNodeByInterface("col");
    if (col != undefined) args.push(`col=${col.value}`);
    else args.push(`col=${this.node.inputs.col.value}`);

    return `${figname}.add_trace(${args.join(", ")})`;
  },
});
