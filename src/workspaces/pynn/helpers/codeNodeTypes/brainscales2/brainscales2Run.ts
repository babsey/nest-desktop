// brainsales2Run.ts

import { NumberInterface, setType } from "baklavajs";
import { defineCodeNode, formatInterfaceLabel, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.run",
  title: "run",
  inputs: {
    time: () => new NumberInterface("time", 1).use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const time = this.node.getConnectedOutputInterfaceByInterface("time");
    if (time != undefined) args.push(`${formatInterfaceLabel(time)}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `pynn.run(${args.join(", ")})`;
  },
});
