// pynnNESTPopulation.ts

import { IntegerInterface, SelectInterface, setType } from "baklavajs";
import { NodeOutputInterface, defineCodeNode, formatInterfaceLabel, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.Population",
  modules: ["pyNN.nest"],
  title: "Population",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
    cellclass: () =>
      new SelectInterface("cellclass", "pyNN.nest.IF_curr_alpha", [
        "pyNN.nest.IF_cond_alpha",
        "pyNN.nest.IF_curr_alpha",
      ]),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    args.push(`${this.node.inputs.size.value}`);

    const cellclass = this.node.getConnectedOutputInterfaceByInterface("cellclass");
    if (cellclass != undefined) args.push(`${formatInterfaceLabel(cellclass)}`);
    else args.push(`${this.node.inputs.cellclass.value}()`);

    return `pyNN.nest.Population(${args.join(", ")})`;
  },
  variableName: "node",
});
