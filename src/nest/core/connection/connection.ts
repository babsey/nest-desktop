// connection.ts

import { ILogObj, Logger } from "tslog";
import { Config } from "@/helpers/config";
import { logger as mainLogger } from "@/utils/logger";

import { ConnectionMask, ConnectionMaskProps } from "./connectionMask";
import {
  ConnectionParameter,
  ConnectionParameterProps,
} from "./connectionParameter";
import { ConnectionRule } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { Connections } from "./connections";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { Network } from "../network/network";
import { Node } from "../node/node";
import { NodeSlice } from "../node/nodeSlice";
import { Synapse, SynapseProps } from "../synapse/synapse";
import { SynapseParameter } from "../synapse/synapseParameter";
import { NodeParameterProps } from "../node/nodeParameter";

export interface ConnectionProps {
  source: number;
  target: number;
  sourceSlice?: NodeParameterProps[];
  targetSlice?: NodeParameterProps[];
  rule?: string;
  params?: ConnectionParameterProps[];
  mask?: ConnectionMaskProps;
  synapse?: SynapseProps;
}

export class Connection extends Config {
  private readonly _name = "Connection";

  private _connections: Connections; // parent
  private _idx: number; // generative
  private _logger: Logger<ILogObj>;
  private _mask: ConnectionMask;
  private _params: { [key: string]: ConnectionParameter } = {};
  private _rule: ConnectionRule;
  private _paramsVisible: string[] = [];
  private _sourceIdx: number; // Node index
  private _sourceSlice: NodeSlice;
  private _state: ConnectionState;
  private _synapse: Synapse;
  private _targetIdx: number; // Node index
  private _targetSlice: NodeSlice;
  private _view: ConnectionView;

  constructor(connections: Connections, connection: ConnectionProps) {
    super("Connection");
    this._connections = connections;
    this._idx = this._connections.all.length;

    this._logger = mainLogger.getSubLogger({
      name: `[${this._connections.network.project.shortId}] connection`,
    });

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._sourceSlice = new NodeSlice(this.source, []);

    this._targetIdx = connection.target;
    this._targetSlice = new NodeSlice(this.target, connection.targetSlice);

    this._rule = new ConnectionRule(this, connection.rule);
    this._mask = new ConnectionMask(this, connection.mask);
    this._synapse = new Synapse(this, connection.synapse);

    this.initParameters(connection.params);
  }

  get connections(): Connections {
    return this._connections;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): ConnectionParameter[] {
    return this._paramsVisible.map((paramId: string) => this._params[paramId]);
  }

  get hasConnSpec(): boolean {
    return this._rule.value !== "all_to_all";
  }

  get hasSomeVisibleParams(): boolean {
    return Object.values(this._params).some(
      (param: ConnectionParameter) => param.state.visible
    );
  }

  get idx(): number {
    return this._idx;
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return this.source.spatial.hasPositions && this.target.spatial.hasPositions;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get mask(): ConnectionMask {
    return this._mask;
  }

  get model(): CopyModel | Model {
    return this._synapse.model;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._connections.network;
  }

  get params(): { [key: string]: ConnectionParameter } {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get recorder(): Node {
    return this.source.model.isRecorder ? this.source : this.target;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get source(): Node {
    return this.network.nodes.all[this._sourceIdx];
  }

  set source(node: Node) {
    this._sourceIdx = node.idx;
  }

  get sourceIdx(): number {
    return this._sourceIdx;
  }

  set sourceIdx(value: number) {
    this._sourceIdx = value;
  }

  get sourceSlice(): NodeSlice {
    return this._sourceSlice;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): Synapse {
    return this._synapse;
  }

  get target(): Node {
    return this.network.nodes.all[this._targetIdx];
  }

  set target(node: Node) {
    this._targetIdx = node.idx;
  }

  get targetIdx(): number {
    return this._targetIdx;
  }

  set targetIdx(value: number) {
    this._targetIdx = value;
  }

  get targetSlice(): NodeSlice {
    return this._targetSlice;
  }

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Add connection parameter.
   */
  addParameter(param: ConnectionParameterProps): void {
    this._params[param.id] = new ConnectionParameter(this, param);
  }

  /**
   * Observer for connection changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this._state.updateHash();
    this._logger.trace("changes");
    this._connections.network.changes();
  }

  /**
   * Clean this component.
   */
  clean(): void {
    this._idx = this._connections.all.indexOf(this);
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this._params).forEach(
      (param: ConnectionParameter) => (param.state.visible = false)
    );
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: ConnectionParameterProps[] = []): void {
    this._logger.trace("init parameter");
    this._paramsVisible = [];
    this._params = {};
    const ruleConfig: any = this.getRuleConfig();
    ruleConfig.params.forEach((param: ConnectionParameterProps) => {
      if (params != null) {
        const p: ConnectionParameterProps | undefined = params.find(
          (p: ConnectionParameterProps) => p.id === param.id
        );
        if (p != null) {
          param.value = p.value;
          if (p.type != null) {
            param.type = p.type;
          }
        }
        if (param && param.visible !== false) {
          this._paramsVisible.push(param.id);
        }
      }
      this.addParameter(param);
    });
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): any {
    return this.config.rules.find((r: any) => r.value === this._rule.value);
  }

  /**
   * Reverse source and target indices.
   *
   * @remarks
   * It emits connection changes.
   */
  reverse(): void {
    this._logger.trace("reverse");
    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];

    // Trigger connection change.
    this.changes();

    // Initialize activity graph.
    if (this._view.connectRecorder()) {
      this.recorder.initActivity();
      // this.network.project.initActivityGraph();
    }
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this._logger.trace("reset");
    this._rule.reset();
    this.initParameters();
    this.synapse.modelId = "static_synapse";
    this._mask.unmask();
    this.changes();
  }

  /**
   * Resets all parameters to their default.
   */
  resetAllParams(): void {
    const ruleConfig: any = this.getRuleConfig();

    // Reset connection parameter.
    Object.values(this._params).forEach((param: ConnectionParameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
    });

    // Reset synapse parameter.
    Object.values(this.synapse.params).forEach((param: SynapseParameter) =>
      param.reset()
    );
  }

  /**
   * Delete connection from the network.
   */
  remove(): void {
    this.network.deleteConnection(this);
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this._params).forEach(
      (param: ConnectionParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return connection object
   */
  toJSON(): ConnectionProps {
    const connection: ConnectionProps = {
      source: this._sourceIdx,
      target: this._targetIdx,
    };

    if (this._rule.value !== "all_to_all") {
      connection.rule = this._rule.value;
    }

    if (this._paramsVisible.length > 0) {
      connection.params = this.filteredParams.map(
        (param: ConnectionParameter) => param.toJSON()
      );
    }

    if (
      this._synapse.modelId !== "static_synapse" ||
      this._synapse.paramsVisible.length > 0
    ) {
      connection.synapse = this._synapse.toJSON();
    }

    if (this._sourceSlice.visible) {
      connection.sourceSlice = this._sourceSlice.toJSON();
    }

    if (this._targetSlice.visible) {
      connection.targetSlice = this._targetSlice.toJSON();
    }

    if (this._mask.hasMask) {
      connection.mask = this._mask.toJSON();
    }

    return connection;
  }
}