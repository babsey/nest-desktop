// norseSequentialState.ts

import { NodeInterface } from "baklavajs";

import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

export default defineDynamicCodeNode({
  type: "norse.torch.SequentialState",
  title: "Sequential state",
  inputs: {
    // events: () => new NodeInterface("events", ""),
    // openButton: () => new NodeInterface("Open Sidebar", undefined).setComponent(markRaw(SidebarButton)).setPort(false),
  },
  outputs: {
    model: () => new NodeInterface("model", ""),
  },
  codeTemplate: () => "norse.torch.SequentialState()",
  onUpdate() {
    const inputs: Record<string, any> = {};

    for (let i = 1; i < 5; i++) {
      inputs["module" + i] = () => new NodeInterface(`module ${i}`, "");
    }
    return {
      inputs,
    };
  },
});
