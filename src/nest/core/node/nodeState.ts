// nodeState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Node } from "./node";
import { NodeParameter } from "./nodeParameter";

interface NodeStateState {
  hash: string;
  targetsLength: number;
  connectionPanelIdx: number | null;
}

export class NodeState {
  private _node: Node; // parent
  private _state: UnwrapRef<NodeStateState>;

  constructor(node: Node) {
    this._node = node;

    this._state = reactive({
      hash: "",
      targetsLength: 0,
      connectionPanelIdx: null,
    });

    this.updateHash();
  }

  get connectionPanelIdx(): number | null {
    return this._state.connectionPanelIdx;
  }

  set connectionPanelIdx(value: number | null) {
    this._state.connectionPanelIdx = value;

    if (this._state.connectionPanelIdx != null) {
      this._node.targets[this._state.connectionPanelIdx].state.select();
    }
  }

  get hash(): string {
    return this._state.hash;
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this._node.nodes.state.focusedNode === this._node;
  }

  /**
   * Check if this node is selected.
   */
  get isSelected(): boolean {
    return this._node.nodes.state.selectedNode === this._node;
  }

  get node(): Node {
    return this._node;
  }

  get state(): UnwrapRef<NodeStateState> {
    return this._state;
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._state.hash ? this._state.hash.slice(0, 6) : "";
  }

  get targetsLength(): number {
    return this._state.targetsLength;
  }

  /**
   * Focus this node
   */
  focus(): void {
    this._node.nodes.state.focusedNode = this._node;
  }

  /**
   * Select this node
   */
  select(): void {
    const nodes = this._node.nodes;
    nodes.state.selectedNode = this.isSelected ? null : this._node;
  }

  update(): void {
    this.updateHash();
    this.updateTargetsLength();
  }

  /**
   * Update hash
   */
  updateHash(): void {
    this._state.hash = sha1({
      model: this._node.modelId,
      params: Object.values(this._node.params).map((param: NodeParameter) =>
        param.toJSON()
      ),
      size: this._node.size,
    }).slice(0, 6);
    this._node.logger.settings.name = `[${this._node.nodes.network.project.shortId}] node ${this._node.modelId} #${this._state.hash}`;
  }

  updateTargetsLength(): void {
    this._state.targetsLength = this._node.targets.length;
  }
}