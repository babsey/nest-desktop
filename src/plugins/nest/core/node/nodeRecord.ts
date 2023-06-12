// nodeRecords.ts - 2 any

import * as d3 from "d3";

import { Activity } from "../activity/activity";
import { Node } from "./node";

export interface NodeRecordProps {
  id: string;
  color: string;
  groupId: string;
}

export class NodeRecord {
  private _activity: Activity;
  private _color: string = "blue";
  private _colorMap: any = {
    max: -55,
    min: -70,
    reverse: false,
    scale: "Spectral",
  };
  private _groupId: string = "0";
  private _id: string;
  private _label: string;
  private _node: Node;
  private _nodeSize: number = 0;
  private _unit: string;

  constructor(node: Node, record: any) {
    this._node = node;
    this._activity = new Activity(this.node);

    this._id = record.id;
    this._label = record.label;
    this._unit = record.unit;

    this.updateGroupID();
    this.updateColor();
  }

  get activity(): Activity {
    return this._activity;
  }

  set activity(value: Activity) {
    this._activity = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get colorMap(): string {
    return this._colorMap;
  }

  get groupId(): string {
    return this._groupId;
  }

  get hasEvent(): boolean {
    return this._id in this._activity.events;
  }

  get hasValues(): boolean {
    return this.values.length > 0;
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get labelCapitalize(): string {
    return this._label.charAt(0).toUpperCase() + this._label.slice(1);
  }

  get node(): Node {
    return this._node;
  }

  get nodeLabel(): string {
    return this._node.view.label;
  }

  get nodeSize(): number {
    return this._nodeSize;
  }

  get times(): number[] {
    return this._activity.events.times;
  }

  get unit(): string {
    return this._unit;
  }

  get values(): number[] {
    return this._activity.events[this._id];
  }

  /**
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._colorMap.min;
    const max: number = this._colorMap.max;
    return (value - min) / (max - min);
  }

  toJSON(): NodeRecordProps {
    return {
      id: this._id,
      color: this._color,
      groupId: this._groupId,
    };
  }

  /**
   * Update node record.
   */
  update(): void {
    this._nodeSize = this._activity.nodeIds.length;
    this.updateGroupID();
    this.updateState();
  }

  /**
   * Update color of the node record.
   */
  updateColor(): void {
    this._color = this.node.view.color;
  }

  /**
   * Update group id of node record.
   */
  updateGroupID(): void {
    this._groupId = this.id + "." + this.node.view.label;
  }

  /**
   * Update state of node record.
   *
   * @remarks:
   * It requires network activity.
   */
  updateState(): void {
    if (!this.hasEvent || !this.hasValues) return;

    const values = this.values;
    this._colorMap.max = d3.max(values);
    this._colorMap.min = d3.min(values);
  }

  /**
   * RGB color for a value in range [0 - 1].
   */
  valueColor(value: number): string {
    const colorScale = d3[`interpolate${this._colorMap.scale}`];
    return colorScale(this._colorMap.reverse ? 1 - value : value);
  }
}
