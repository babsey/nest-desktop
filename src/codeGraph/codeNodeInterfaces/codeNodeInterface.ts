// codeNodeInterface.ts

import { markRaw } from "vue";
import { NodeInterface } from "baklavajs";

import CodeNodeInterfaceComponent from "./CodeNodeInterfaceComponent.vue";

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public graphId: string = "";

  constructor(name: string, value: T) {
    super(name, value);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));
  }

  setValue(value: T): void {
    this.value = value;
    this.setHidden(false);
  }
}
