// plotlyHistogram.ts

import { TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.express.histogram",
  modules: ["plotly.express"],
  title: "histogram",
  inputs: {
    data_frame: () => new NodeInputInterface("data_frame"),
    x: () => new TextInputInterface("x", ""),
    y: () => new TextInputInterface("y", ""),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const data_frame = this.node.getConnectedNodesByInterface("data_frame");
    if (data_frame.length > 0) args.push(`${this.code?.graph.formatLabels(data_frame).join(", ")}`);

    const x = this.node.getConnectedNodesByInterface("x");
    if (x.length > 1) args.push(`x=[${this.code?.graph.formatLabels(x).join(", ")}]`);
    else if (x.length > 0) args.push(`x=${this.code?.graph.formatLabels(x).join(", ")}`);
    else if (this.node.inputs.x.value) args.push(`x=${this.node.inputs.x.value}`);

    const y = this.node.getConnectedNodesByInterface("y");
    if (y.length > 1) args.push(`y=[${this.code?.graph.formatLabels(y).join(", ")}]`);
    else if (y.length > 0) args.push(`y=${this.code?.graph.formatLabels(y).join(", ")}`);
    else if (this.node.inputs.y.value) args.push(`y="${this.node.inputs.y.value}"`);

    return `px.histogram(${args.join(", ")})`;
  },
});
