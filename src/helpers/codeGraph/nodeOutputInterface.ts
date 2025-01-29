// nodeOutputInterface.ts

import { markRaw } from "vue";

import NodeOutputComponent from "../../components/codeGraph/NodeOutputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeOutputInterface<T = any> extends CodeNodeInterface<T> {
  constructor() {
    super("", null as T);
    this.setComponent(markRaw(NodeOutputComponent));
  }
}
