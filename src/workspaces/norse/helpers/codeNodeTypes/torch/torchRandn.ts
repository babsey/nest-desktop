// torchRandn.ts

import { displayInSidebar, IntegerInterface, NodeInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.randn",
  title: "randn",
  inputs: {
    batch: () => new IntegerInterface("batch", 1).use(setType, numberType).use(displayInSidebar, true),
    channel: () => new IntegerInterface("channel", 1).use(setType, numberType).use(displayInSidebar, true),
    x: () => new IntegerInterface("x", 1).use(setType, numberType).use(displayInSidebar, true),
    y: () => new IntegerInterface("y", 1).use(setType, numberType).use(displayInSidebar, true),
    // events: () => new NodeInterface("events", ""),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () =>
    "torch.randn({{ inputs.batch.value }}, {{ inputs.channel.value}}, {{ inputs.x.value }}, {{ inputs.y.value }})",
});
