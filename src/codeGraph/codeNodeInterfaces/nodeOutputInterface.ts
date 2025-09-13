// nodeOutputInterface.ts

import { markRaw } from "vue";

import NodeOutputInterfaceComponent from "./NodeOutputInterfaceComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeOutputInterface<T = unknown> extends CodeNodeInterface<T> {
  private _codeTemplate = "";

  constructor(name: string = "", codeTemplate: string = "") {
    super(name, null as T);
    this._codeTemplate = codeTemplate;
    this.setComponent(markRaw(NodeOutputInterfaceComponent));
  }

  get codeTemplate(): string {
    return this._codeTemplate;
  }

  get label(): string {
    return `${this.node?.label}${this.codeTemplate ? this.codeTemplate : ""}`;
  }
}
