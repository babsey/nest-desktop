// code.ts

import { AxiosResponse } from "axios";

import functionNode from "@/helpers/codeNodeTypes/base/function";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCode } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { IParamProps } from "@/helpers/common/parameter";

import nest from "../../stores/backends/nestSimulatorStore";
import nestConnect from "../codeNodeTypes/nestConnect";
import nestCreate from "../codeNodeTypes/nestCreate";
import nestDataResponse from "../codeNodeTypes/nestDataResponse";
import nestInstall from "../codeNodeTypes/nestInstall";
import nestRandomUniform from "../codeNodeTypes/nestRandomUniform";
import nestResetKernel from "../codeNodeTypes/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nestSimulate";
import nestSpatialFree from "../codeNodeTypes/nestSpatialFree";
import { INESTConnectionProps, NESTConnection } from "../connection/connection";
import { INESTNetworkProps } from "../network/network";
import { INESTNodeProps, NESTNode } from "../node/node";
import { INESTSimulationProps } from "../simulation/simulation";
import { NESTProject } from "../project/project";
import { INESTCopyModelProps } from "../model/copyModel";
import nestCopyModel from "../codeNodeTypes/nestCopyModel";
import { IntegerInterface, NodeInterface, NumberInterface, TextInputInterface } from "baklavajs";
import nestParameters from "../codeNodeTypes/nestParameters";

const roles = [
  "resetKernel",
  "installModule",
  "setKernelStatus",
  "copyNodeModel",
  "nodeParams",
  "nodePos",
  "createNode",
  "copySynapseModel",
  "connectNodes",
  "simulate",
  "getPos",
  "nestDataResponse",
];

export class NESTCode extends BaseCode {
  constructor(project: NESTProject) {
    super(project);
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  /**
   * Execute simulation code with or without insite.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return nest.exec(this.script);
    // return this.doRunSimulationInsite ? this.execWithInsite() : nest.exec(this.script);
  }

  /**
   * Add code nodes.
   */
  addBaseCodeNodes(): void {
    this.logger.trace("add base code nodes");

    this.graph.unsubscribe();

    // nest.ResetKernel
    this.graph.addNodeAtColumn(nestResetKernel, 0, 100);

    // response of nest data
    this.graph.addNodeAtColumn(nestDataResponse, 4, 100);

    this.graph.subscribe();
  }

  /**
   * Add connect nodes.
   * @param connection connnection component
   */
  addConnectNodes(connection: NESTConnection): AbstractCodeNode {
    const nodes = this.graph.nodes.filter((node) => node.state.role === "createNode");
    const idx = connection.idx;

    const codeNode = this.graph.addNodeAtColumn(nestConnect, 3, 100 + 200 * idx);
    if (idx === 0) codeNode.state.comments = "Connect nodes";
    if (connection.synapse) {
      if (connection.synapse.model) codeNode.inputs.model.value = connection.synapse.modelId;
      // connection.synapse.params?.forEach((param: IParamProps) => (codeNode.inputs.weight.value = param.value));
    }

    this.graph.addConnection(codeNode.inputs.pre, nodes[connection.sourceIdx].outputs.out);
    this.graph.addConnection(nodes[connection.targetIdx].outputs.out, codeNode.inputs.post);

    return codeNode;
  }

  /**
   * Add create node.
   * @param node node component
   */
  addCreateNode(node: NESTNode): AbstractCodeNode {
    const nodes = this.graph.nodes.filter((node) => node.state.role === "createNode");
    const idx = nodes.length;

    const codeNode = this.graph.addNodeAtColumn(nestCreate, 2, 100 + 290 * idx);
    codeNode.variableName = node.model.isNeuron ? "n" : node.model.abbreviation;
    codeNode.networkItem = node;
    if (idx === 0) codeNode.state.comments = "Create nodes";

    return codeNode;
  }

  addNodeParams(node: NESTNode): AbstractCodeNode {
    const nodes = this.graph.nodes.filter((node) => node.state.role === "nodeParams");
    const idx = nodes.length;

    const paramsNode = this.graph.addNodeAtColumn(nestParameters, 1, 100 + 260 * idx);
    paramsNode.state.role = "nodeParams";
    paramsNode.networkItem = node;
    paramsNode.state.integrated = true;

    return paramsNode;
  }

  /**
   * Add code nodes from network props.
   */
  addNetworkCodeNodes(networkProps: INESTNetworkProps): void {
    this.logger.trace("add network code nodes");
    if (!networkProps) return;

    let codeNode: AbstractCodeNode;
    const nodes: AbstractCodeNode[] = [];
    const spatialNodes: AbstractCodeNode[] = [];
    const weightRecorders: AbstractCodeNode[] = [];

    this.graph.unsubscribe();

    // Copy node model
    if (networkProps.models && networkProps.models.length > 0) {
      networkProps.models
        .filter((model) => !model.existing.includes("synapse"))
        .forEach((model: INESTCopyModelProps) => {
          // nest.CopyModel
          codeNode = this.graph.addNodeAtColumn(nestCopyModel, 1, 100);
          codeNode.state.role = "copyNodeModel";
          codeNode.inputs.existing.value = model.existing;
          codeNode.inputs.new.value = model.new;
          model.params?.forEach((param) => {
            const inputInterface = new NumberInterface(param.id, param.value as number);
            codeNode.addInput(param.id, inputInterface);
          });
        });
    }

    if (networkProps.nodes && networkProps.nodes.length > 0) {
      const nodesProps = networkProps.nodes as INESTNodeProps[];
      nodesProps.forEach((nodeProps: INESTNodeProps, idx: number) => {
        let paramsNode: AbstractCodeNode;

        // params
        if (nodeProps.params) {
          paramsNode = this.graph.addNodeAtColumn(nestParameters, 1, 100 + 260 * idx);
          paramsNode.state.role = "nodeParams";
          paramsNode.state.integrated = true;

          nodeProps.params?.forEach((param) => {
            let inputInterface;
            if (typeof param.value == "number") {
              inputInterface = new IntegerInterface(param.id, param.value as number);
            } else {
              inputInterface = new TextInputInterface(param.id, JSON.stringify(param.value));
            }
            paramsNode.addInput(param.id, inputInterface);
          });
        }

        // positions
        let posNode: AbstractCodeNode;
        if (nodeProps.spatial) {
          const randNode = this.graph.addNodeAtColumn(nestRandomUniform, 0, 900);
          randNode.state.role = "nodePos";
          randNode.state.integrated = true;
          randNode.inputs.min.value = -0.5;
          randNode.inputs.max.value = 0.5;
          posNode = this.graph.addNodeAtColumn(nestSpatialFree, 1, 900);
          posNode.state.role = "node";
          posNode.state.integrated = true;
          this.graph.addConnection(randNode.outputs.out, posNode.inputs.pos);
        }

        // nest.Create
        codeNode = this.graph.addNodeAtColumn(nestCreate, 2, 100 + 290 * idx);
        if (idx === 0) codeNode.state.comments = "Create nodes";
        // codeNode.variableName = nodeProps.model as string;
        codeNode.inputs.model.value = nodeProps.model;
        codeNode.inputs.size.value = nodeProps.size ?? 1;
        if (nodeProps.model === "weight_recorder") {
          codeNode.variableName = "wr";
          weightRecorders.push(codeNode);
        }

        if (paramsNode) this.graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);

        if (posNode) {
          this.graph.addConnection(posNode.outputs.out, codeNode.inputs.positions);
          codeNode.events.update.emit({
            type: "input",
            intf: codeNode.inputs.positions,
            name: "positions",
          });
          spatialNodes.push(codeNode);
        }

        nodes.push(codeNode);
      });
    }
    // Copy synapse model
    if (networkProps.models && networkProps.models.length > 0) {
      networkProps.models
        .filter((model) => model.existing.includes("synapse"))
        .forEach((model: INESTCopyModelProps, idx: number) => {
          // nest.CopyModel
          codeNode = this.graph.addNodeAtColumn(nestCopyModel, 3, 1500 + idx * 600);
          codeNode.state.role = "copySynapseModel";
          codeNode.inputs.existing.value = model.existing;
          codeNode.inputs.new.value = model.new;
          model.params?.forEach((param) => {
            let nodeInterface: NodeInterface;
            switch (typeof param.value) {
              case "number":
                nodeInterface = new NumberInterface(param.id, param.value as number);
                break;
              default:
                nodeInterface = new TextInputInterface(param.id, param.value as string);
                break;
            }
            codeNode.addInput(param.id, nodeInterface);
          });

          const weightRecorderParam = model.params?.find((param) => param.id === "weight_recorder");
          if (weightRecorderParam) {
            const weightRecorderCode = weightRecorders.find(
              (codeNode, idx) => codeNode.variableName + (idx + 1) === weightRecorderParam.value,
            );
            if (weightRecorderCode)
              this.graph.addConnection(weightRecorderCode.outputs.out, codeNode.inputs.weight_recorder);
          }
        });
    }

    if (networkProps?.connections && networkProps.connections.length > 0) {
      networkProps.connections.forEach((connection: INESTConnectionProps, idx: number) => {
        // nest.Connect
        codeNode = this.graph.addNodeAtColumn(nestConnect, 3, 100 + 200 * idx);
        if (idx === 0) codeNode.state.comments = "Connect nodes";
        if (connection.synapse) {
          if (connection.synapse.model) codeNode.inputs.model.value = connection.synapse.model;
          connection.synapse.params?.forEach((param: IParamProps) => (codeNode.inputs.weight.value = param.value));
        }
        this.graph.addConnection(codeNode.inputs.pre, nodes[connection.source].outputs.out);
        this.graph.addConnection(nodes[connection.target].outputs.out, codeNode.inputs.post);
      });
    }

    // define function getPos
    if (spatialNodes.length > 0) {
      const posNode = this.graph.addNodeAtColumn(functionNode, 3, 800);
      posNode.state.role = "getPos";
      // posNode.inputs.code.value = "def getPos(n): return dict(zip(n.global_id, nest.GetPosition(n)))";
      posNode.inputs.code.value = "getPos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    }

    // update response
    const responseNode = this.graph.findNodeByType("nest/response");
    if (responseNode) {
      if (nodes.length > 0) {
        nodes
          .filter((node: AbstractCodeNode) => node.outputs.events)
          .forEach((node: AbstractCodeNode) => {
            this.graph.addConnection(node.outputs.events, responseNode.inputs.events);
          });
      }

      if (spatialNodes.length > 0) {
        spatialNodes.forEach((spatialNode) => {
          this.graph.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions);
        });
      }
    }

    this.graph.subscribe();
  }

  /**
   * Add code nodes from simulation props.
   */
  addSimulationCodeNodes(simulationProps: INESTSimulationProps): void {
    this.logger.trace("add simulation code nodes");
    let codeNode: AbstractCodeNode;

    this.graph.unsubscribe();

    if (simulationProps?.modules) {
      simulationProps.modules.forEach((module) => {
        // nest.Install
        codeNode = this.graph.addNodeAtColumn(nestInstall, 0, 200);
      });
    }

    // nest.SetKernelStatus
    codeNode = this.graph.addNodeAtColumn(nestSetKernelStatus, 0, 350);
    if (simulationProps?.kernel) {
      codeNode.inputs.local_num_threads.value = simulationProps.kernel.localNumThreads;
      codeNode.inputs.resolution.value = simulationProps.kernel.resolution;
      codeNode.inputs.rng_seed.value = simulationProps.kernel.rngSeed;
    }

    // nest.Simulate
    codeNode = this.graph.addNodeAtColumn(nestSimulate, 0, 450);
    codeNode.inputs.time.value = simulationProps?.time ?? 1000;

    this.graph.subscribe();
  }

  /**
   * Initialize code component.
   * @remarks It generates code.
   */
  override init(): void {
    this.logger.trace("init");

    this.initGraph();
    this.loadNodes();
    this.generate();
  }

  /**
   * Load nodes
   */
  loadNodes(): void {
    this.logger.trace("load nodes");

    const projectProps = this.project.toJSON();
    if (projectProps.network?.nodes?.length > 0) {
      this.addBaseCodeNodes();
      this.addSimulationCodeNodes(projectProps.simulation as INESTSimulationProps);
      // this.addNetworkCodeNodes(projectProps.network as INESTNetworkProps);
      this.sortNodes();
    }

    this.graph.onUpdate();
  }

  /**
   * sort nodes by roles.
   */
  sortNodes(): void {
    this._sortNodes(roles);
  }

  updateNodeParams(node: NESTNode): void {
    if (!node.codeNodes.param) return;
    const paramsNode = node.codeNodes.param;

    node.filteredParams
      .filter((param) => param.id in paramsNode.inputs)
      .forEach((param) => {
        paramsNode.inputs[param.id].value = param.value;
      });
  }

  // /**
  //  * Run simulation with recording backend Insite.
  //  * @remarks During the simulation it gets and updates activities from access node.
  //  */
  // private async execWithInsite(): Promise<AxiosResponse<IAxiosResponseData>> {
  //   this.logger.trace("run simulation with Insite");

  //   this.project.simulation.state.timeInfo = {
  //     begin: 0,
  //     current: 0,
  //     end: 0,
  //     stepSize: 1,
  //   };

  //   return nest
  //     .exec(this.script, "")
  //     .then((response: AxiosResponse<IAxiosResponseData>) => {
  //       switch (response.status) {
  //         case 200:
  //           if (this.doRunSimulation) this.project.insite.simulationEndNotification();

  //           break;
  //         default:
  //           notifyError("Failed to find NEST simulation instance.");
  //           this.project.insite.cancelAllIntervals();
  //           break;
  //       }
  //       return response;
  //     })
  //     .catch((error: AxiosError<IAxiosErrorData | string>) => {
  //       this.project.insite.cancelAllIntervals();
  //       if ("response" in error && error.response?.data != undefined) notifyError(error.response.data as string);
  //     });
  // }
}
