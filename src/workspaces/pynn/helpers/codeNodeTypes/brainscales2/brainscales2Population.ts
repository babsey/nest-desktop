// brainscales2Population.ts

import { IntegerInterface, SelectInterface, setType } from "baklavajs";
import { NodeOutputInterface, formatInterfaceLabel, defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.Population",
  title: "Population",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
    cellclass: () => new SelectInterface("cellclass", "pynn.cells.HXNeuron", ["pynn.cells.HXNeuron"]),
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

    return `pynn.Population(${args.join(", ")})`;
  },
  variableName: "node",
});
