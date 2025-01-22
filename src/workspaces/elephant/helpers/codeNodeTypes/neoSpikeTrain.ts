// neoSpiketrain.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInterface } from "baklavajs";

export default defineCodeNode({
  type: "neo.core.spikeTrain",
  title: "SpikeTrain",
  inputs: {
    times: () => new NodeInterface("times", ""),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "neo.core.SpikeTrain({{ inputs.times.value }})",
});
