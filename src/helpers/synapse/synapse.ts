// synapse.ts

import { TConnection, TSynapseParamProps, TSynapseParameter } from "@/types";

import { BaseObj } from "../common/base";
import { BaseSynapseParameter } from "./synapseParameter";

export interface ISynapseProps {
  params?: TSynapseParamProps[];
}

export class BaseSynapse extends BaseObj {
  private readonly _name = "Synapse";
  public _params: Record<string, TSynapseParameter> = {};
  public _paramsVisible: string[] = [];

  public _connection: TConnection; // parent

  constructor(connection: TConnection, synapseProps?: ISynapseProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._connection = connection;
    this.initParameters(synapseProps?.params);
  }

  get connection(): TConnection {
    return this._connection;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): TSynapseParameter[] {
    return this.paramsVisible.map((paramId) => this.params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this.paramsVisible.length > 0;
  }

  get icon(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "network:synapse-recorder";
    } else {
      return (
        "network:synapse-" + (this.weight > 0 ? "excitatory" : "inhibitory")
      );
    }
  }

  /**
   * Check if synapse parameter can be spatial.
   */
  get isSpatial(): boolean {
    return false;
  }

  get name(): string {
    return this._name;
  }

  get paramsAll(): TSynapseParameter[] {
    return Object.values(this._params);
  }

  get params(): Record<string, TSynapseParameter> {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get weight(): number {
    let weight: TSynapseParameter = this.params.weight;
    return weight ? (weight.value as number) : 1;
  }

  set weight(value: number) {
    this.params.weight.state.value = value;
  }

  get weightColor(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "grey";
    } else {
      return this.weight > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.weight === 0
      ? ""
      : this.weight > 0
      ? "excitatory"
      : "inhibitory";
  }

  set weightLabel(value: string) {
    this.weight =
      (value === "inhibitory" ? -1 : 1) * Math.abs(this.weight as number);
  }

  /**
   * Add parameter component.
   * @param paramProps- synapse parameter props
   */
  addParameter(paramProps: TSynapseParamProps): void {
    // this._logger.trace("add parameter:", param)
    this._params[paramProps.id] = new BaseSynapseParameter(this, paramProps);
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  changes(): void {
    this.logger.trace("changes");

    this.updateHash();
    this.connection.changes();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this._paramsVisible = [];
  }

  /**
   * Initialize synapse.
   */
  init(): void {
    this.logger.trace("init");

    this.updateHash();
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(paramsProps?: TSynapseParamProps[]): void {
    this.logger.trace("init parameters");

    this._paramsVisible = [];
    this._params = {};
    if (paramsProps) {
      paramsProps.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");

    const weight: TSynapseParameter = this._params.weight;
    if (typeof weight.value === "number") {
      weight.visible = true;
      weight.state.value = -1 * weight.value;
      this.connection.changes();
    }
  }

  /**
   * Reset synapse parameter values.
   */
  reset(): void {
    this.filteredParams.forEach((param: TSynapseParameter) => param.reset());
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: TSynapseParameter) => (param.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return synapse props
   */
  toJSON(): ISynapseProps {
    const synapseProps: ISynapseProps = {};

    if (this.filteredParams.length > 0) {
      synapseProps.params = this.filteredParams.map(
        (param: TSynapseParameter) => param.toJSON()
      );
    }

    return synapseProps;
  }

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
