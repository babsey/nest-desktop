// nodeInputInterface.ts

import { markRaw } from "vue";

import NodeInputComponent from "../../components/codeGraph/NodeInputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeInputInterface<T = any> extends CodeNodeInterface<T> {
  constructor(name: string = "") {
    super(name, null as T);
    this.setComponent(markRaw(NodeInputComponent));
  }
}
