// nodeInputInterface.ts

import { markRaw } from "vue";

import NodeInputComponent from "../../components/codeGraph/NodeInputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeInputInterface<T = any> extends CodeNodeInterface<T> {
  private _integrated: boolean = false;

  constructor(name: string = "", integrated: boolean = false) {
    super(name, null as T);
    this.setComponent(markRaw(NodeInputComponent));
    this._integrated = integrated;
  }

  get integrated(): boolean {
    return this._integrated;
  }

  // get value(): T {
  //   const nodes = this.node?.getConnectedNodesByInterface(this.name);
  //   if (nodes) return nodes.map((node) => node.label).join(", ") as T;
  //   return this._value;
  // }
}
