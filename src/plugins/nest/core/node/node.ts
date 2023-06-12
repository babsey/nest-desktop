// node.ts - 26 anys

import { Config } from "@/helpers/config";

import { Activity } from "../activity/activity";
import { AnalogSignalActivity } from "../activity/analogSignalActivity";
import { Connection } from "../connection/connection";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { ModelParameter } from "../model/modelParameter";
import { Network } from "../network/network";
import {
  NodeCompartment,
  nodeCompartmentProps,
} from "./nodeCompartment/nodeCompartment";
import { NodeParameter, nodeParamProps } from "./nodeParameter";
import { NodeReceptor, nodeReceptorProps } from "./nodeReceptor/nodeReceptor";
import { NodeRecord, recordProps } from "./nodeRecord";
import { NodeSpatial, nodeSpatialProps } from "./nodeSpatial/nodeSpatial";
import { NodeState } from "./nodeState";
import { NodeView, nodeViewProps } from "./nodeView";
import { Nodes } from "./nodes";
import { Parameter } from "../parameter";
import { SpikeActivity } from "../activity/spikeActivity";

export interface nodeProps {
  model?: string;
  size?: number;
  params?: nodeParamProps[];
  view?: nodeViewProps;
  annotations?: string[];
  spatial?: nodeSpatialProps;
  records?: recordProps[];
  receptors?: nodeReceptorProps[];
  compartments?: nodeCompartmentProps[];
  activity?: any;
}

export class Node extends Config {
  private readonly _name = "Node";

  private _activity: SpikeActivity | AnalogSignalActivity | Activity = new Activity(this);
  private _annotations: string[] = [];
  private _compartments: NodeCompartment[] = [];
  private _doc: nodeProps;
  private _idx: number; // generative
  private _modelId: string;
  private _nodes: Nodes; // parent
  private _params: { [key: string]: NodeParameter } = {};
  private _paramsVisible: string[] = [];
  private _positions: number[][] = [];
  private _receptors: NodeReceptor[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = []; // only for multimeter
  private _size: number;
  private _spatial: NodeSpatial;
  private _state: NodeState;
  private _view: NodeView;

  constructor(nodes: Nodes, node: nodeProps = {}) {
    super("Node");

    this._nodes = nodes;
    this._idx = this._nodes.all.length;

    this._modelId = node.model || "iaf_psc_alpha";
    this._size = node.size || 1;
    this._annotations = node.annotations || [];
    this._doc = node;

    this._spatial = new NodeSpatial(this, node.spatial);
    this._view = new NodeView(this, node.view);

    this.initParameters(node);
    this.initCompartments(node);
    this.initReceptors(node);
    this.initActivity(node.activity);

    this._state = new NodeState(this);
  }

  get activity(): SpikeActivity | AnalogSignalActivity | Activity {
    return this._activity;
  }

  set activity(value: SpikeActivity | AnalogSignalActivity | Activity) {
    this._activity = value;
  }

  get annotations(): string[] {
    return this._annotations;
  }

  get assignedModels(): CopyModel[] {
    if (this._modelId !== "weight_recorder") {
      return [];
    }

    return this.network.models.filter((model: CopyModel) =>
      Object.values(model.params).some(
        (param: Parameter) => param.value === this.view.label
      )
    );
  }

  get color(): string {
    return this._view.color;
  }

  get connectedNodes(): Node[] {
    if (this.model.isSpikeRecorder) {
      return this.sourceNodes;
    }
    if (this.model.isAnalogRecorder) {
      return this.targetNodes;
    }
    return [];
  }

  get connections(): Connection[] {
    return this.network.connections.filter(
      (connection: Connection) =>
        connection.source === this || connection.target === this
    );
  }

  get compartments(): NodeCompartment[] {
    return this._compartments;
  }

  get compartmentIndices(): number[] {
    return this._compartments.map(
      (compartment: NodeCompartment) => compartment.idx
    );
  }

  get compartmentRecordables(): any[] {
    return [
      ...this._compartments.map((comp: NodeCompartment) => comp.recordables),
    ];
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get filteredParams(): NodeParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hasCompartments(): boolean {
    return this._compartments.length > 0;
  }

  get hasReceptors(): boolean {
    return this._receptors.length > 0;
  }

  get hash(): string {
    return this._state.hash;
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model.isNeuron && this._view.weight === "excitatory";
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this.model.isNeuron && this._view.weight === "inhibitory";
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    return this._view.label;
  }

  get model(): CopyModel | Model {
    if (
      this.network.models.some((model: CopyModel) => model.id === this.modelId)
    ) {
      return this.network.models.get(this._modelId);
    } else {
      return this.network.project.modelStore.getModel(this._modelId);
    }
  }

  /**
   * Set model.
   *
   * @remarks
   * Save model ID, see modelId.
   *
   * @param model - node model
   */
  set model(model: CopyModel | Model) {
    this.modelId = model.id;
  }

  get models(): (CopyModel | Model)[] {
    // Get models of the same element type.
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this.network.project.modelStore.getModels(elementType);

    // Get copied models.
    const modelsCopied: CopyModel[] =
      this.network.models.filterByElementType(elementType);

    const filteredModels = [...models, ...modelsCopied];
    filteredModels.sort();

    return filteredModels;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model ID.
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param value - id of the model
   */
  set modelId(value: string) {
    this._paramsVisible = [];
    this._modelId = value;

    this.initParameters();
    this.initCompartments();
    this.initReceptors();

    this.initActivity();

    this.updateRecords();
    this.updateRecordsColor();

    // Trigger node change.
    this.nodeChanges();

    // Initialize activity graph.
    if (this.model.isRecorder) {
      this.network.project.initActivityGraph();
    }
  }

  get modelParams(): { [key: string]: ModelParameter } {
    return this.model.params;
  }

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._nodes.network;
  }

  get nodes(): Nodes {
    return this._nodes;
  }

  get params(): { [key: string]: NodeParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NodeParameter }) {
    Object.values(values).forEach((value: NodeParameter) => {
      this._params[value.id] = new NodeParameter(this, value);
    });
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    Object.values(this._params).forEach((param) => {
      param.state.visible = values.includes(param.id);
    });
    // this._paramsVisible = Object.keys(this.modelParams).filter((paramId) =>
    //   values.includes(paramId)
    // );
    this.nodeChanges();
  }

  get positions(): number[][] {
    return this._positions;
  }

  get receptors(): NodeReceptor[] {
    return this._receptors;
  }

  get receptorRecordables(): any[] {
    return [
      ...this._receptors.map((receptor: NodeReceptor) => receptor.recordables),
    ];
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  get records(): NodeRecord[] {
    return this._records;
  }

  set records(value: NodeRecord[]) {
    this._records = value;
  }

  get recordsFixed(): string {
    return (
      "[" +
      this._records.map((record: NodeRecord) => '"' + record.id + '"').join(",") +
      "]"
    );
  }

  get recordSpikes(): boolean {
    return (
      this.connections.filter((connection: Connection) =>
        connection.view.connectSpikeRecorder()
      ).length > 0
    );
  }

  get hasSomeVisibleParams(): boolean {
    return (
      this._paramsVisible.length > 0 ||
      this._modelId === "multimeter" ||
      this.network.project.simulation.code.runSimulationInsite
    );
  }

  get size(): number {
    return this._size;
  }

  /**
   * Set network size.
   */
  set size(value: number) {
    this._size = value;
    this.nodeChanges();
  }

  get sourceNodes(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter((connection: Connection) => connection.targetIdx === this._idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  get state(): NodeState {
    return this._state;
  }

  get targets(): Connection[] {
    return this.network.connections.filter(
      (connection: Connection) => connection.sourceIdx === this._idx
    );
  }

  get targetNodes(): Node[] {
    return this.network.connections
      .filter((connection: Connection) => connection.sourceIdx === this._idx)
      .map((connection: Connection) => connection.target);
  }


  get view(): NodeView {
    return this._view;
  }

  get weight(): string {
    return this._view.weight;
  }

  /**
   * Add annotation to the list.
   * @param text - string
   */
  addAnnotation(text: string): void {
    if (this._annotations.indexOf(text) !== -1) return;
    this._annotations.push(text);
    this.nodeChanges();
  }

  /**
   * Add compartment component.
   * @param comp - compartment object
   */
  addCompartment(comp: any = {}): void {
    const compartment = new NodeCompartment(this, comp);
    this._compartments.push(compartment);
    compartment.clean();
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: nodeParamProps): void {
    this._params[param.id] = new NodeParameter(this, param);
    // this._params.push(new NodeParameter(this, param));
  }

  /**
   * Add receptor component.
   * @param receptor - receptor object
   */
  addReceptor(receptor: any): void {
    this._receptors.push(new NodeReceptor(this, receptor));
  }

  /**
   * Clean node component.
   */
  clean(): void {
    this._idx = this._nodes.all.indexOf(this);
    this.view.clean();
    this._state.updateHash();

    // this.updateRecords();
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  clone(): Node {
    return new Node(this._nodes, { ...this.toJSON() });
  }

  /**
   * Initialize activity for the recorder.
   */
  initActivity(data: any = {}): void {
    if (!this.model.isRecorder) {
      return;
    }
    if (this.model.isSpikeRecorder) {
      this._activity = new SpikeActivity(this, data);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new AnalogSignalActivity(this, data);
    } else {
      this._activity = new Activity(this, data);
    }
  }

  /**
   * Initialize compartments for the node.
   * @param node - node object
   */
  initCompartments(node?: any): void {
    this._compartments = [];
    if (node && node.compartments) {
      node.compartments.forEach((compartment: any) =>
        this.addCompartment(compartment)
      );
    }
  }

  /**
   * Initialize receptors for the node.
   * @param node - node object
   */
  initReceptors(node?: any): void {
    this._receptors = [];
    if (node && node.receptors) {
      node.receptors.forEach((receptor: any) => this.addReceptor(receptor));
    }
  }

  /**
   * Initialize parameter components.
   * @param node - node object
   */
  initParameters(node?: nodeProps): void {
    // console.log("Update parameters from model or node", node);
    this._paramsVisible = [];
    this._params = {};
    if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        if (node && node.params && node.params.length > 0) {
          const nodeParam = node.params.find(
            (param: any) => param.id === modelParam.id
          );
          if (nodeParam) {
            this.addParameter({
              ...modelParam.options,
              ...nodeParam,
            });
            if (
              ("visible" in nodeParam && nodeParam.visible) ||
              !("visible" in nodeParam)
            ) {
              this._paramsVisible.push(nodeParam.id);
            }
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (node && node.params) {
      Object.values(node.params).forEach((param: any) =>
        this.addParameter(param)
      );
    }
  }

  /**
   * Get parameter component.
   * @param paramId - parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): NodeParameter {
    return this._params[paramId];
  }

  /**
   * Check if node has params.
   */
  hasParameters(node: nodeProps): boolean {
    return "params" in node;
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some(
      (paramKey: string) => paramKey === paramId
    );
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsVisible = [];

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.hideAllParams()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.hideAllParams()
      );
    }
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  nodeChanges(): void {
    this.clean();
    this._spatial.updateHash();
    this.network.networkChanges();
  }

  /**
   * Delete node.
   *
   * @remarks
   * It removes node component of the network.
   */
  remove(): void {
    this.network.deleteNode(this);
  }

  /**
   * Remove annotation from the list.
   * @param text - string
   */
  removeAnnotation(text: string): void {
    if (this._annotations.indexOf(text) === -1) return;
    this._annotations.splice(this._annotations.indexOf(text), 1);
    this.nodeChanges();
  }

  /**
   * Remove compartment from the node.
   */
  removeCompartment(compartment: NodeCompartment): void {
    // Remove all receptors linking to this compartment.
    compartment.receptors.forEach((receptor: NodeReceptor) =>
      receptor.remove()
    );

    // Remove compartment from the list.
    this._compartments.splice(this._compartments.indexOf(compartment), 1);
    this._compartments = [...this._compartments];
  }

  /**
   * Remove receptor from the node.
   */
  removeReceptor(receptor: NodeReceptor): void {
    this._receptors.splice(this._receptors.indexOf(receptor), 1);
    this._receptors = [...this._receptors];
  }

  /**
   * Remove record from the state.
   */
  removeRecord(record: any): void {
    this._records.splice(this._records.indexOf(record), 1);
    this._records = [...this._records];
  }

  reset(): void {
    this._compartments = [];
    this._receptors = [];
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    Object.values(this._params).forEach((param: NodeParameter) =>
      param.reset()
    );

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.resetParameters()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.resetParameters()
      );
    }

    this.nodeChanges();
  }

  /**
   * Set all synaptic weights.
   *
   * @remarks
   * It emits node changes.
   *
   * @param term - inhibitory (negative) or excitatory (positive)
   */
  setWeights(term: string): void {
    const connections: Connection[] = this.network.connections.filter(
      (connection: Connection) =>
        connection.source.idx === this._idx &&
        !connection.target.model.isRecorder
    );
    connections.forEach((connection: Connection) => {
      const weight: any = connection.synapse.params.weight;
      weight.value = (term === "inhibitory" ? -1 : 1) * Math.abs(weight.value);
      weight.state.visible = true;
    });
    this.nodeChanges();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.showAllParams()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.showAllParams()
      );
    }
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(): void {
    const term: string = this._size === 1 ? "grid" : "free";
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });
    this.nodeChanges();
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): nodeProps {
    const node: nodeProps = {
      model: this._modelId,
      view: this._view.toJSON(),
    };

    if (this._size > 1) {
      node.size = this._size;
    }

    if (this.filteredParams.length > 0) {
      node.params = this.filteredParams.map((param: NodeParameter) =>
        param.toJSON()
      );
    }

    // Add annotations if provided.
    if (this._annotations.length > 0) {
      node.annotations = this._annotations;
    }

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      node.records = this._records.map((nodeRecord: NodeRecord) =>
        nodeRecord.toJSON()
      );
    }

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) {
      node.spatial = this._spatial.toJSON();
    }

    if (this._compartments.length > 0) {
      node.compartments = this._compartments.map(
        (compartment: NodeCompartment) => compartment.toJSON()
      );
    }

    if (this._receptors.length > 0) {
      node.receptors = this._receptors.map((receptor: NodeReceptor) =>
        receptor.toJSON()
      );
    }

    return node;
  }

  /**
   * Update records.
   *
   * @remarks
   * It should be called after connections are created.
   */
  updateRecords(): void {
    let recordables: any[] = [];
    // Initialize recordables.
    if (this.targets.length > 0) {
      if (this.model.isMultimeter) {
        const recordablesNodes = this.targetNodes.map((target: Node) => {
          return target.modelId === "cm_default"
            ? [
                ...target.compartmentRecordables,
                ...target.receptorRecordables,
              ].flat()
            : [...target.model.recordables];
        });
        if (recordablesNodes.length > 0) {
          const recordablesPooled: any[] = recordablesNodes.flat();
          recordables = [...new Set(recordablesPooled)];
          recordables.sort((a: any, b: any) => a.id - b.id);
        }
      } else if (this._modelId === "voltmeter") {
        recordables.push(
          this.model.config.recordables.find(
            (record: any) => record.id === "V_m"
          )
        );
      }
    } else if (this._modelId === "weight_recorder") {
      recordables.push(
        this.model.config.recordables.find(
          (record: any) => record.id === "weights"
        )
      );
    }

    let recordableIds: string[];
    recordableIds = recordables.map((record: any) => record.id);
    this._recordables = [
      ...this._recordables.filter((record: NodeRecord) =>
        recordableIds.includes(record.id)
      ),
    ];

    recordableIds = this._recordables.map((record: any) => record.id);
    recordables
      .filter((record: any) => !recordableIds.includes(record.id))
      .forEach((record: any) => {
        this._recordables.push(new NodeRecord(this, record));
      });

    // Initialize selected records.
    if (this._doc.records != null) {
      // Load record from stored nodes.
      const recordIds = this._doc.records.map((record: any) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
    } else if (this._records.length > 0) {
      // In case when user select other model.
      const recordIds = this._records.map((record: NodeRecord) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
      this.records.forEach((record: NodeRecord) => record.updateGroupID());
    } else {
      this._records = [...this._recordables];
    }
  }

  // /**
  //  * Update receptor component.
  //  * @param receptorOld - node receptor object
  //  * @param receptorNew - receptor object
  //  */
  // updateReceptor(receptorOld: NodeReceptor, receptorNew: any): void {
  //   receptorNew.compIdx = receptorOld.compartment.idx;
  //   const receptorIdx = this._receptors.indexOf(receptorOld);
  //   this._receptors[receptorIdx] = new NodeReceptor(this, receptorNew);
  //   this._receptors = [...this._receptors];
  // }

  /**
   * Update record colors.
   */
  updateRecordsColor(): void {
    const color = this._view.color;
    this._recordables.forEach((record: NodeRecord) => {
      record.color = color;
    });
  }
}
