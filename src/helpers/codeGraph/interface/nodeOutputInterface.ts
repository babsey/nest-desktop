// nodeOutputInterface.ts

import { markRaw } from "vue";

import NodeOutputComponent from "@/components/codeGraph/NodeOutputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeOutputInterface<T = any> extends CodeNodeInterface<T> {
  constructor(name: string = "") {
    super(name, null as T);
    this.setComponent(markRaw(NodeOutputComponent));
  }

  // get value(): T {
  //   if (this.node) return this.node.label as T;
  //   return this._value as T;
  // }
}
