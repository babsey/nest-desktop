// node.ts

import Mustache from "mustache";

import { BaseNode, INodeProps } from "@/helpers/node/node";
import { INodeParamProps } from "@/helpers/node/nodeParameter";
import { TConnection } from "@/types";

import { NorseConnection } from "../connection/connection";
import { NorseModel } from "../model/model";
import { NorseSimulation } from "../simulation/simulation";
import { NorseNodes } from "./nodes";

export interface INorseNodeProps extends INodeProps {}

// export class NorseNode extends BaseNode<NorseModel> {
export class NorseNode extends BaseNode {
  private _code: string = "";

  constructor(nodes: NorseNodes, nodeProps: INorseNodeProps = {}) {
    super(nodes, nodeProps);
  }

  get code(): string {
    return this._code;
  }

  override get connections(): NorseConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx
    ) as NorseConnection[];
  }

  get duration(): number {
    return (
      this.hasStart && this.hasStop
        ? (this.simulation.time > this.stop
            ? this.stop
            : this.simulation.time) - this.start
        : this.hasStart
        ? this.simulation.time > this.start
          ? this.simulation.time - this.start
          : 0
        : this.hasStop
        ? this.stop
        : this.simulation.time
    ) as number;
  }

  get hasStart(): boolean {
    return this.paramsVisible.includes("start");
  }

  get hasStop(): boolean {
    return this.paramsVisible.includes("stop");
  }

  override get model(): NorseModel {
    if (this._model?.id !== this.modelId) {
      this._model = this.getModel(this.modelId);
    }
    return this._model as NorseModel;
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }

  get postOff(): number {
    return this.simulation.time > this.stop
      ? this.simulation.time - this.stop
      : 0;
  }

  override get simulation(): NorseSimulation {
    return this.nodes.network.project.simulation as NorseSimulation;
  }

  get start(): number {
    return this.params.start.value as number;
  }

  get stop(): number {
    return this.params.stop.value as number;
  }

  /**
   * Clone this node component.
   * @return norse node object
   */
  override clone(): NorseNode {
    return new NorseNode(this.nodes, { ...this.toJSON() });
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  override changes(): void {
    this.logger.trace("changes");

    this.clean();
    this.updateHash();
    this.generateCode();

    this.nodes.network.changes();
  }

  /**
   * Generate code.
   */
  generateCode(): void {
    this._code = Mustache.render(this.model.codeTemplate, this);
  }

  /**
   * Load model.
   */
  override loadModel(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("load model:", this._modelId, paramsProps);

    this._model = this.getModel(this._modelId);
    this.addParameters(paramsProps);

    this.generateCode();
  }
}
