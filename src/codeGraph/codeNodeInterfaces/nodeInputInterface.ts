// nodeInputInterface.ts

import { markRaw } from "vue";

import NodeInputInterfaceComponent from "./NodeInputInterfaceComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  constructor(name: string = "") {
    super(name, null as T);
    this.setComponent(markRaw(NodeInputInterfaceComponent));
  }

  get code(): string {
    const nodes = this.node?.getConnectedNodesByInterface(this.name);
    if (nodes)
      return nodes.map((node) => (node.state.integrated ? node.codeTemplate : node.label)).join(", ") as string;
    return this.value as string;
  }
}
