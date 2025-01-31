// code.ts

import { AxiosResponse } from "axios";

import response from "@/helpers/codeNodeTypes/base/response";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCode, ICodeProps } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import nest from "../../stores/backends/nestSimulatorStore";
import nestConnect from "../codeNodeTypes/nestConnect";
import nestCreate from "../codeNodeTypes/nestCreate";
import nestResetKernel from "../codeNodeTypes/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nestSimulate";
import { INESTNodeProps } from "../node/node";
import { INESTProjectProps, NESTProject } from "../project/project";
import { INESTConnectionProps } from "../connection/connection";
import { IParamProps } from "@/helpers/common/parameter";
import nestInstall from "../codeNodeTypes/nestInstall";
import nestRandomUniform from "../codeNodeTypes/nestRandomUniform";
import nestSpatialFree from "../codeNodeTypes/nestSpatialFree";

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

  override initGraph(): void {
    this.logger.trace("init graph");

    this.graph.unsubscribe();
    this.graph.init();
    this.updateCodeGraph();
    this.graph.subscribe();
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

  /**
   * Update code graph from network props.
   */
  updateCodeGraph(): void {
    this.logger.trace("update graph from network");
    const left = 300;
    const width = 350;
    const space = 70;
    let codeNode;

    // nest.ResetKernel
    this.graph.addNodeWithCoordinates(nestResetKernel, left, 100);

    const simulation = this.project.simulation;

    if (simulation?.modules) {
      // nest.Install
      codeNode = this.graph.addNodeWithCoordinates(nestInstall, left, 200);
    }

    // nest.SetKernelStatus
    codeNode = this.graph.addNodeWithCoordinates(nestSetKernelStatus, left, 350);
    if (simulation.kernel) {
      codeNode.inputs.local_num_threads.value = simulation.kernel.localNumThreads;
      codeNode.inputs.resolution.value = simulation.kernel.resolution;
      codeNode.inputs.rng_seed.value = simulation.kernel.rngSeed;
    }

    const nodes: AbstractCodeNode[] = [];

    const network = this.project.network;
    const networkProps = network.toJSON();
    if (networkProps.nodes && networkProps.nodes.length > 0) {
      // nest.Create
      const nodesProps = networkProps.nodes as INESTNodeProps[];
      nodesProps.forEach((nodeProps: INESTNodeProps, idx: number) => {
        let posNode;
        if (nodeProps.spatial) {
          const randNode = this.graph.addNodeWithCoordinates(nestRandomUniform, left, 900);
          randNode.inputs.min.value = -0.5;
          randNode.inputs.max.value = 0.5;
          posNode = this.graph.addNodeWithCoordinates(nestSpatialFree, left + width + space, 900);
          this.graph.addConnection(randNode.outputs.out, posNode.inputs.pos);
        }
        const codeNode = this.graph.addNodeWithCoordinates(nestCreate, left + width + space, 100 + 260 * idx);
        codeNode.inputs.model.value = nodeProps.model;
        codeNode.inputs.size.value = nodeProps.size ?? 1;

        if (nodeProps.spatial) {
          this.graph.addConnection(posNode.outputs.out, codeNode.inputs.positions);
        }

        nodes.push(codeNode);
        codeNode.twoColumn = true;
      });
    }

    if (networkProps.connections && networkProps.connections.length > 0) {
      // nest.Connect
      networkProps.connections.forEach((connection: INESTConnectionProps, idx: number) => {
        const codeNode = this.graph.addNodeWithCoordinates(nestConnect, left + 2 * (width + space), 100 + 200 * idx);
        if (connection.synapse) {
          connection.synapse.params?.forEach((param: IParamProps) => {
            codeNode.inputs.weight.value = param.value;
          });
        }
        this.graph.addConnection(codeNode.inputs.pre, nodes[connection.source].outputs.out);
        this.graph.addConnection(nodes[connection.target].outputs.out, codeNode.inputs.post);
        codeNode.twoColumn = true;
      });
    }

    // nest.Simulate
    codeNode = this.graph.addNodeWithCoordinates(nestSimulate, left, 450);
    codeNode.inputs.time.value = simulation?.time ?? 1000;

    if (nodes.length > 0) {
      // response
      const responseNode = this.graph.addNodeWithCoordinates(response, left + 2 * (width + space), 600);
      nodes
        .filter((node: AbstractCodeNode) => node.outputs.events)
        .forEach((node: AbstractCodeNode) => {
          this.graph.addConnection(node.outputs.events, responseNode.inputs.events);
        });
    }

    this.graph.save();
  }
}
