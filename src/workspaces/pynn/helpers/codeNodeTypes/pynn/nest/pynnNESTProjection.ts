// pynnNESTProjection.ts

import { SelectInterface } from "baklavajs";
import { NodeInputInterface, defineCodeNode, formatInterfaceLabels } from "@/codeGraph";

export default defineCodeNode({
  type: "pyNN.nest.Projection",
  modules: ["pyNN.nest"],
  title: "Projection",
  inputs: {
    presynaptic_neurons: () => new NodeInputInterface("presynaptic_neurons"),
    postsynaptic_neurons: () => new NodeInputInterface("postsynaptic_neurons"),
    connector: () =>
      new SelectInterface("connector", "pynn.AlltoAllConnector", ["pynn.AlltoAllConnector", "pynn.OneToOneConnector"]),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const presynapticNeurons = this.node.getConnectedOutputInterfacesByInterface("presynaptic_neurons");
    const postsynapticNeurons = this.node.getConnectedOutputInterfacesByInterface("postsynaptic_neurons");
    if (presynapticNeurons.length === 0 || postsynapticNeurons.length === 0) return this.type;

    const args: string[] = [
      formatInterfaceLabels(presynapticNeurons).join("+") as string,
      formatInterfaceLabels(postsynapticNeurons).join("+") as string,
    ];

    args.push(this.node.inputs.connector.value as string);

    return `pyNN.nest.Projection(${args.join(", ")})`;
  },
});
