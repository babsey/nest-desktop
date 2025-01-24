// code.ts

import { BaseCode, ICodeProps } from "@/helpers/code/code";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";

import nest from "../../stores/backends/nestSimulatorStore";
import { AxiosResponse } from "axios";
import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { NESTConnection } from "../connection/connection";
import { NESTNode } from "../node/node";
import { NESTProject } from "../project/project";
import nestResetKernel from "../codeNodeTypes/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nestSetKernelStatus";
import nestCreate from "../codeNodeTypes/nestCreate";
import nestConnect from "../codeNodeTypes/nestConnect";
import nestSimulate from "../codeNodeTypes/nestSimulate";

export class NESTCode extends BaseCode {
  constructor(project: NESTProject, simulationCodeProps: ICodeProps = {}) {
    super(project, {
      ...simulationCodeProps,
    });
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  // override addNodes(): void {
  //   this.addNode("nest/ResetKernel");
  //   this.addNode("nest/SetKernelStatus");
  //   this.project.network.nodes.nodeItems.forEach((node: NESTNode) => this.addNode("nest/Create", { node }));
  //   this.project.network.connections.all.forEach((connection: NESTConnection) => {
  //     this.addNode("nest/Connect", { connection });
  //   });
  //   this.addNode("nest/Simulate", { simulation: this.project.simulation });
  // }

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
    this.updateCodeGraphfromNetwork();
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
   * Update code craph from network.
   */
  updateCodeGraphfromNetwork(): void {
    this.logger.trace("update graph from network");
    const left = 300;
    const width = 350;
    const space = 70;
    let codeNode;

    // nest.ResetKernel
    this.graph.addNodeWithCoordinates(nestResetKernel, left, 100);

    // nest.SetKernelStatus
    codeNode = this.graph.addNodeWithCoordinates(nestSetKernelStatus, left, 200);
    codeNode.inputs.local_num_threads.value = this.project.simulation.kernel.localNumThreads;
    codeNode.inputs.resolution.value = this.project.simulation.kernel.resolution;
    codeNode.inputs.rng_seed.value = this.project.simulation.kernel.rngSeed;

    // nest.Create
    const nodes: AbstractCodeNode[] = [];
    this.project.network.nodes.nodeItems.forEach((node: NESTNode, idx: number) => {
      const codeNode = this.graph.addNodeWithCoordinates(nestCreate, left + width + space, 100 + 200 * idx);
      codeNode.inputs.model.value = node.modelId;
      codeNode.inputs.size.value = node.size;
      codeNode.twoColumn = true;
      nodes.push(codeNode);
    });

    // nest.Connect
    this.project.network.connections.all.forEach((connection: NESTConnection, idx: number) => {
      const codeNode = this.graph.addNodeWithCoordinates(nestConnect, left + 2 * (width + space), 100 + 200 * idx);
      codeNode.twoColumn = true;
      this.graph.addConnection(codeNode.inputs.pre, nodes[connection.sourceIdx].outputs.node_collection);
      this.graph.addConnection(nodes[connection.targetIdx].outputs.node_collection, codeNode.inputs.post);
    });

    // nest.Simulate
    codeNode = this.graph.addNodeWithCoordinates(nestSimulate, left, 300);
    codeNode.inputs.time.value = this.project.simulation.time;

    this.graph.save();
  }
}
