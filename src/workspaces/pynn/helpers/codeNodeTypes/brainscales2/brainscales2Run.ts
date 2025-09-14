// brainsales2Run.ts

import { NumberInterface, setType } from "baklavajs";
import { defineCodeNode, numberType } from "@/codeGraph";

export default defineCodeNode({
  type: "brainscales2.run",
  title: "run",
  inputs: {
    time: () => new NumberInterface("time", 1).use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const time = this.node.getConnectedNodeByInterface("time");
    if (time != undefined) args.push(`${time.value}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `pynn.run(${args.join(", ")})`;
  },
});
