// plotlyHistogram.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";
import { NodeInputInterface, NodeOutputInterface, defineCodeNode, numberType } from "@/codeGraph";

import { getPlotlyGraphObjectsArgs } from "../express/helpers";

export default defineCodeNode({
  type: "plotly.graph_objects.Histogram",
  title: "Histogram",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
    nbinsx: () =>
      new IntegerInterface("nbins x", 10).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "hist",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = getPlotlyGraphObjectsArgs(this.node);

    if (!this.node.inputs.nbinsx?.hidden) {
      const nbinsx = this.node.getConnectedNodeByInterface("nbinsx");
      if (nbinsx != undefined) args.push(`nbinsx=${nbinsx.value}`);
      else if (this.node.inputs.nbinsx?.value) args.push(`nbinsx=${this.node.inputs.nbinsx?.value}`);
    }

    return `go.Histogram(${args.join(", ")})`;
  },
});
