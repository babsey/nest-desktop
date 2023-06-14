// copyModel.ts

import { reactive, UnwrapRef } from "vue";
import { Parameter } from "@/helpers/parameter";

import { Connection } from "../connection/connection";
import { Model } from "../model/model";
import { ModelCompartmentParameter } from "./modelCompartmentParameter";
import { ModelParameter, ModelParameterProps } from "./modelParameter";
import { ModelReceptor } from "./modelReceptor/modelReceptor";
import { Network } from "../network/network";
import { Node } from "../node/node";

export interface CopyModelProps {
  existing: string;
  new: string;
  params?: ModelParameterProps[];
}

interface CopyModelState {
  visible: boolean;
}

export class CopyModel {
  private readonly _name = "CopyModel";

  private _existingModelId: string;
  private _idx: number;
  private _network: Network;
  private _newModelId: string;
  private _params: { [key: string]: ModelParameter } = {};
  private _state: UnwrapRef<CopyModelState>;

  constructor(
    network: Network,
    model: CopyModelProps = { existing: "", new: "" }
  ) {
    this._network = network;
    this._existingModelId = model.existing;
    this._newModelId = model.new;

    this._idx = this.network.models.length;
    this._state = reactive({
      visible: true,
    });

    this.initParameters(model);
  }

  get abbreviation(): string {
    return this.model.abbreviation;
  }

  get config(): { [key: string]: string } {
    return this.model.config;
  }

  get compartmentParams(): { [key: string]: ModelCompartmentParameter } {
    return this.model.compartmentParams;
  }

  get connections(): Connection[] {
    return this._network.connections.filter(
      (connection: Connection) =>
        connection.synapse.modelId === this._newModelId
    );
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get existingModelId(): string {
    return this._existingModelId;
  }

  /**
   * This method sets the model ID to <ID of parent model> + '_copied' to avoid
   * naming collisions.
   * @param value New model ID
   */
  set existingModelId(value: string) {
    const renameNew = this.newModelId.includes(this._existingModelId);
    this._existingModelId = value;
    if (renameNew) {
      this.newModelId = value + "_copied" + (this._idx + 1);
    }
    this.initParameters();
    this.modelChanges();
  }

  get hasSomeVisibleParams(): boolean {
    return Object.values(this._params).some(
      (param: ModelParameter) => param.state.visible
    );
  }

  get hasWeightRecorderParam(): boolean {
    return "weight_recorder" in this._params;
  }

  get id(): string {
    return this._newModelId;
  }

  /**
   * Check if the model is an analog recorder.
   */
  get isAnalogRecorder(): boolean {
    return this.isRecorder && !this.isSpikeRecorder;
  }

  /**
   * Check if the model is a multimeter.
   */
  get isMultimeter(): boolean {
    return this._existingModelId === "multimeter";
  }

  /**
   * Check if the model is a neuron.
   */
  get isNeuron(): boolean {
    return this.elementType === "neuron";
  }

  /**
   * Check if the model is a recorder.
   */
  get isRecorder(): boolean {
    return this.elementType === "recorder";
  }

  /**
   * Check if the model is a spike recorder.
   */
  get isSpikeRecorder(): boolean {
    return this._existingModelId === "spike_recorder";
  }

  /**
   * Check if the model is a stimulator.
   */
  get isStimulator(): boolean {
    return this.elementType === "stimulator";
  }

  /**
   * Check if the model is a synapse.
   */
  get isSynapse(): boolean {
    return this.elementType === "synapse";
  }

  /**
   * Check if the model is a weight recorder.
   */
  get isWeightRecorder(): boolean {
    return this._existingModelId === "weight_recorder";
  }

  get idx(): number {
    return this._idx;
  }

  get filteredParams(): ModelParameter[] {
    return Object.values(this._params).filter(
      (param: ModelParameter) => param.state.visible
    );
  }

  /**
   * Check if model has params.
   */
  get hasParameters(): boolean {
    return Object.keys(this._params).length > 0;
  }

  get label(): string {
    return this._newModelId;
  }

  get model(): Model {
    return this._network.project.modelStore.getModel(this._existingModelId);
  }

  get models(): Model[] {
    return this._network.project.modelStore.models as Model[];
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get newModelId(): string {
    return this._newModelId;
  }

  /**
   * Sets the new model ID to `value` and updates all nodes and connections.
   * @param value New model ID
   */
  set newModelId(value: string) {
    const nodes = this.nodes;
    const connections = this._network.connections.filter(
      (connection: Connection) =>
        connection.synapse.modelId === this._newModelId
    );
    this._newModelId = value;
    nodes.forEach((node: Node) => (node.modelId = this._newModelId));
    connections.forEach(
      (connection: Connection) =>
        (connection.synapse.modelId = this._newModelId)
    );
  }

  get nodes(): Node[] {
    return this._network.nodes.filter(
      (node: Node) => node.modelId === this._newModelId
    );
  }

  get params(): { [key: string]: ModelParameter } {
    return this._params;
  }

  set params(values: { [key: string]: ModelParameter }) {
    this._params = { ...this._params, ...values };
  }

  get receptors(): { [key: string]: ModelReceptor } {
    return this.model.receptors;
  }

  get recordables(): any[] {
    return this.model.recordables;
  }

  get state(): UnwrapRef<CopyModelState> {
    return this._state;
  }

  get weightRecorder(): Node | undefined {
    if (!this.hasWeightRecorderParam) {
      return new Node(this._network.nodes);
    }

    // Get weight recorder parameter.
    const weightRecorderParam = this._params.weight_recorder;

    // Return weight recorder node.
    return this._network.nodes.weightRecorders.find(
      (node: Node) => node.view.label === weightRecorderParam.value
    );
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params[param.id] = new ModelParameter(this, param);
  }

  // /**
  //  * Add parameter component.
  //  * @param param - parameter object
  //  */
  // addParameter(param: any): void {
  //   const parameter = new Parameter(this, param);
  //   parameter.state.visible = true;
  //   this._params.push(parameter);
  // }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addWeightRecorderParameter(param: any): void {
    this.addParameter({
      id: "weight_recorder",
      input: "select",
      label: "weight recorder",
      items: this._network.nodes.weightRecorders.map(
        (recorder: Node) => recorder.view.label
      ),
      value: param.value,
      visible: true,
    });
  }

  clean(): void {
    this._idx = this._network.models.all.indexOf(this);

    const weightRecorderParam: any = this._params.weight_recorder;

    // Update weight recorder list to select.
    if (weightRecorderParam) {
      weightRecorderParam.items = this._network.nodes.weightRecorders.map(
        (recorder: Node) => recorder.view.label
      );
    }
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this.params).map(
      (param: ModelParameter) => (param.state.visible = false)
    );
  }

  /**
   * Initialize parameter components.
   * @param model - model object
   */
  initParameters(model: any = null): void {
    // Update parameters from model
    this._params = {};
    if (this.model && model && "params" in model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = model.params.find((p: any) => p.id === modelParam.id);
        this.addParameter(param || modelParam.toJSON());
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((param: ModelParameter) =>
        this.addParameter(param.toJSON())
      );
    } else if ("params" in model) {
      model.params.forEach((param: any) => this.addParameter(param));
    }

    if (this.model.isSynapse) {
      const weightRecorders = this._network.nodes.recorders
        .filter((recorder: Node) => recorder.model.id === "weight_recorder")
        .map((recorder: Node) => recorder.view.label);
      let weightRecorder: string = weightRecorders[weightRecorders.length - 1];

      if (model && "params" in model) {
        const weightRecorderParam = model.params.find(
          (param: Parameter) => param.id === "weight_recorder"
        );
        if (weightRecorderParam) {
          weightRecorder = weightRecorderParam.value;
        }
      }

      if (weightRecorder) {
        this.addWeightRecorderParameter({
          value: weightRecorder,
        });
      }
    }
  }

  isAssignedToWeightRecorder(node: Node): boolean {
    const weightRecorderParam: Parameter = this._params.weight_recorder;
    return weightRecorderParam
      ? weightRecorderParam.value === node.view.label
      : false;
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits network changes.
   */
  modelChanges(): void {
    this._network.networkChanges();
  }

  /**
   * Delete model.
   *
   * @remarks
   * It removes model component of the network.
   */
  remove(): void {
    this._network.nodes
      .filter((node: Node) => node.modelId === this.newModelId)
      .forEach((node: Node) => (node.modelId = this._existingModelId));
    this._network.connections
      .filter(
        (connection: Connection) =>
          connection.synapse.modelId === this.newModelId
      )
      .forEach(
        (connection: Connection) =>
          (connection.synapse.modelId = this._existingModelId)
      );
    this._network.deleteModel(this);
    this.clean();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).map(
      (param: ModelParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): CopyModelProps {
    const model: CopyModelProps = {
      existing: this._existingModelId,
      new: this._newModelId,
      params: this.filteredParams.map((param: ModelParameter) =>
        param.toJSON()
      ),
    };

    return model;
  }
}