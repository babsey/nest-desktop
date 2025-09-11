// codeGraph.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCodeGraph } from "@/helpers/codeGraph/baseCodeGraph";

import { INESTConnectionProps } from "../connection/connection";
import { INESTCopyModelProps } from "../model/copyModel";
import { INESTNetworkProps } from "../network/network";
import { INESTNodeProps } from "../node/node";
import { INESTProjectProps } from "../project/project";
import { loadNESTConnectNode } from "../codeNodeTypes/nest/nestConnect";
import { loadNESTCopyModelNode, loadNESTCopySynapseModelNode } from "../codeNodeTypes/nest/nestCopyModel";
import { loadNESTCreateNode } from "../codeNodeTypes/nest/nestCreate";
import { loadNESTDataResponseNode } from "../codeNodeTypes/nest/nestDataResponse";
import { loadNESTInstallNodes } from "../codeNodeTypes/nest/nestInstall";
import { loadNESTResetKernelNode } from "../codeNodeTypes/nest/nestResetKernel";
import { loadNESTSetKernelStatusNode } from "../codeNodeTypes/nest/nestSetKernelStatus";
import { loadNESTSimulationNode } from "../codeNodeTypes/nest/nestSimulate";

export class NESTCodeGraph extends BaseCodeGraph {
  constructor(projectProps: INESTProjectProps) {
    super();

    this.loadByProject(projectProps);
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

    this.onUpdate();
  }

  /**
   * load code nodes from network props.
   */
  loadNetworkNodes(networkProps: INESTNetworkProps): void {
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
}
