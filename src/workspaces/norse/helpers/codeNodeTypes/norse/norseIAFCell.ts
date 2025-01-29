// norseIAFCell.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/nodeOutputInterface";

export default defineCodeNode({
  type: "norse.IAFCell",
  title: "IAF cell",
  inputs: {
    // events: () => new NodeInterface("events", ""),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "norse.torch.IAFCell()",
});
