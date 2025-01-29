// neoSpiketrain.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "neo.core.spikeTrain",
  title: "spiketrain",
  inputs: {
    times: () => new NodeInputInterface("times"),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: (node) =>
    node ? `neo.core.SpikeTrain(${node.inputs.times.value})` : "neo.core.SpikeTrain({{ inputs.times.value }})",
});
