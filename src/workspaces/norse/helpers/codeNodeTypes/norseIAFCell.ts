// norseIAFCell.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "norse.IAFCell",
  title: "IAF Cell",
  inputs: {
    // events: () => new NodeInterface("events", ""),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "norse.torch.IAFCell()",
});
