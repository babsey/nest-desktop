// codeGraph.ts

import toposort from "toposort";
import { Connection, Graph, IBaklavaViewModel, IEditorState, INodeState, NodeInterface, useBaklava } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseObj } from "@/helpers/common/base";
import { setViewSettings } from "@/plugins/baklava";

import { INESTConnectionProps } from "../connection/connection";
import { INESTCopyModelProps } from "../model/copyModel";
import { INESTNetworkProps } from "../network/network";
import { INESTNodeProps } from "../node/node";
import { INESTProjectProps } from "../project/project";
import { loadNESTCopyModelNode, loadNESTCopySynapseModelNode } from "../codeNodeTypes/nest/nestCopyModel";
import { loadNESTCreateNode } from "../codeNodeTypes/nest/nestCreate";
import { loadNESTDataResponseNode } from "../codeNodeTypes/nest/nestDataResponse";
import { loadNESTInstallNodes } from "../codeNodeTypes/nest/nestInstall";
import { loadNESTResetKernelNode } from "../codeNodeTypes/nest/nestResetKernel";
import { loadNESTSetKernelStatusNode } from "../codeNodeTypes/nest/nestSetKernelStatus";
import { loadNESTSimulationNode } from "../codeNodeTypes/nest/nestSimulate";
import { loadNESTConnectNode } from "../codeNodeTypes/nest/nestConnect";
import { findNodeByType, getCodeNodes } from "@/helpers/codeGraph/codeGraph";

export class NESTCodeGraph extends BaseObj {
  private _viewModel: IBaklavaViewModel;

  constructor(projectProps: INESTProjectProps) {
    super();
    // this.logger.settings.minLevel = 1;

    this._viewModel = useBaklava();
    setViewSettings(this._viewModel);

    this.loadByProject(projectProps);
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this);
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  get graph(): Graph {
    return this._viewModel.displayedGraph;
  }

  get nodeIds(): string[] {
    return this.nodes.map((node: AbstractCodeNode) => node.id);
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values as AbstractCodeNode[];
  }

  get viewModel(): IBaklavaViewModel {
    return this._viewModel;
  }

  addConnection(from: NodeInterface, to: NodeInterface): void {
    from.hidden = false;
    to.hidden = false;
    this.graph.addConnection(from, to);
  }

  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return findNodeByType(this, nodeType);
  }

  /**
   * Check whether the graph has this connection.
   * @param from node interface
   * @param to node interface
   * @returns boolean
   */
  hasConnection(from: NodeInterface, to: NodeInterface): boolean {
    return this.connections.some(
      (connection: Connection) => connection.from.id === from.id && connection.to.id === to.id,
    );
  }

  /**
   * Load code graph from project props.
   */
  loadByProject(projectProps: INESTProjectProps): void {
    loadNESTResetKernelNode(this);

    // nest.Install
    if (projectProps.simulation?.modules) loadNESTInstallNodes(this, projectProps.simulation.modules);

    // nest.SetKernelStatus
    if (projectProps.simulation?.kernel) loadNESTSetKernelStatusNode(this, projectProps.simulation.kernel);

    // nest.Create & nest.Connect
    if (projectProps.network) this.loadNetworkNodes(projectProps.network);

    // nest.Simulate
    if (projectProps.simulation) loadNESTSimulationNode(this, projectProps.simulation);

    loadNESTDataResponseNode(this);
  }

  /**
   * load code nodes from network props.
   */
  loadNetworkNodes(networkProps: INESTNetworkProps): void {
    this.logger.trace("add network code nodes");
    if (!networkProps) return;

    if (networkProps.models) {
      const nodeModels = networkProps.models.filter(
        (modelProps: INESTCopyModelProps) => !modelProps.existing.includes("synapse"),
      );

      if (nodeModels) nodeModels.forEach((modelProps: INESTCopyModelProps) => loadNESTCopyModelNode(this, modelProps));
    }

    let nestNodes: AbstractCodeNode[] = [];
    if (networkProps.nodes)
      nestNodes = networkProps.nodes.map((nodeProps: INESTNodeProps) => loadNESTCreateNode(this, nodeProps));

    if (networkProps.models) {
      const synapseModels = networkProps.models.filter((modelProps: INESTCopyModelProps) =>
        modelProps.existing.includes("synapse"),
      );

      if (synapseModels) {
        const weightRecorders: AbstractCodeNode[] = nestNodes.filter(
          (codeNode: AbstractCodeNode) => codeNode.inputs.model.value === "weight_recorder",
        );
        synapseModels.forEach((modelProps: INESTCopyModelProps) =>
          loadNESTCopySynapseModelNode(this, modelProps, weightRecorders),
        );
      }
    }

    if (networkProps.connections)
      networkProps.connections.forEach((connectionProps: INESTConnectionProps) =>
        loadNESTConnectNode(this, connectionProps, nestNodes),
      );
  }

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IEditorState {
    this.logger.trace("save");

    this.sortNodes();

    const editorState = this._viewModel.editor.save();
    this.saveNodeStates(editorState.graph.nodes);

    return editorState;
  }

  /**
   * Save node states.
   * @param nodeStates a list of node state.
   */
  saveNodeStates(nodeStates: INodeState<unknown, unknown>[]): void {
    nodeStates.forEach((nodeState: INodeState<unknown, unknown>, nodeIdx) => {
      const node = this.nodes[nodeIdx] as AbstractCodeNode;
      nodeState.integrated = node.state.integrated;
      nodeState.props = node.state.props;

      Object.entries(nodeState.inputs).forEach(([inputKey]) => {
        if (node.inputs[inputKey]) nodeState.inputs[inputKey].hidden = node.inputs[inputKey].hidden;
      });

      Object.entries(nodeState.outputs).forEach(([outputKey]) => {
        if (node.inputs[outputKey]) nodeState.outputs[outputKey].hidden = node.outputs[outputKey].hidden;
      });
    });
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return;
    this.logger.trace("sort nodes");

    try {
      // Get a list of edges
      const edges: [string, string | undefined][] = this.connections.map((connection: Connection) => [
        connection.to.nodeId,
        connection.from.nodeId,
      ]);

      // Get a list of node
      let nodeIds = [...this.nodeIds];

      nodeIds.reverse();

      // Get sorted node ids
      nodeIds = toposort.array(nodeIds, edges);

      nodeIds.reverse();

      // Update sorted nodes
      this.nodes = nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
    } catch {
      this.logger.warn("Sorting nodes failed.");
    }
  }
}
