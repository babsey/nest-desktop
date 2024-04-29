// nodes.ts

import { BaseNodes } from "@/helpers/node/nodes";

import { NESTNetwork } from "../network/network";
import { INESTNodeProps, NESTNode } from "./node";
import { NESTActivityGraph } from "../activity/activityGraph";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TNode } from "@/types/nodeTypes";

export class NESTNodes extends BaseNodes {
  constructor(network: NESTNetwork, nodesProps?: INESTNodeProps[]) {
    super(network, nodesProps);
  }

  override get Node() {
    return NESTNode;
  }

  /**
   * Check if the network has some nodes with compartments
   */
  get hasSomeNodeCompartments(): boolean {
    return this.nodes.some((node: NESTNode) => node.compartments.length > 0);
  }

  /**
   * Check if the network has some nodes with receptors
   */
  get hasSomeNodeReceptors(): boolean {
    return this.nodes.some((node: NESTNode) => node.receptors.length > 0);
  }

  /**
   * Check if the network has some spatial nodes
   */
  get hasSomeSpatialNodes(): boolean {
    return this.nodes.some((node: NESTNode) => node.spatial.hasPositions);
  }

  get isWeightRecorderSelected(): boolean {
    const selectedNode = this.state.selectedNode as NESTNode;
    return selectedNode ? selectedNode.model.isWeightRecorder : false;
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  override get neurons(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isNeuron
    ) as NESTNode[];
  }

  override get nodes(): NESTNode[] {
    return this._nodes.filter(
      (node: TNode | NodeGroup) => node.constructor.name !== "NodeGroup"
    ) as NESTNode[];
  }

  override get recorders(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isRecorder
    ) as NESTNode[];
  }

  /**
   * Get spatial nodes
   */
  get spatialNodes(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.spatial.hasPositions);
  }

  override get stimulators(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isStimulator
    ) as NESTNode[];
  }

  /**
   * Get nodes with weight recorders.
   */
  get weightRecorders(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.model.isWeightRecorder);
  }

  /**
   * Clean weight recorder components.
   */
  cleanWeightRecorders(): void {
    this.weightRecorders.forEach((node: NESTNode) => node.clean());
  }

  /**
   * Update records color of recorders.
   *
   * @remarks
   * It updates colors in activity chart graph and in activity animation graph.
   */
  override updateRecordsColor(): void {
    this.logger.trace("update records color");
    this.recorders.forEach((recorder: NESTNode) => {
      recorder.updateRecordsColor();
    });

    const activityGraph = this.network.project
      .activityGraph as NESTActivityGraph;

    if (activityGraph.activityChartGraph) {
      activityGraph.activityChartGraph.updateRecordsColor();
    }

    if (activityGraph.activityAnimationGraph) {
      activityGraph.activityAnimationGraph.renderFrameLayers();
    }
  }
}
