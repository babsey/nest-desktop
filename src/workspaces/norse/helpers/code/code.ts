// code.ts

import { AxiosResponse } from "axios";

import response from "@/helpers/codeNodeTypes/base/response";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCode } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import norse from "../../stores/backends/norseSimulatorStore";
import { NorseProject } from "../project/project";
export class NorseCode extends BaseCode {
  constructor(project: NorseProject) {
    super(project);
  }

  override get project(): NorseProject {
    return this._project as NorseProject;
  }

  /**
   * Execute simulation code.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return norse.exec(this.script);
  }

  override initGraph(): void {
    this.logger.trace("init graph");

    this.graph.unsubscribe();
    this.graph.clear();
    this.updateCodeGraph();
    this.graph.onUpdate();
    this.graph.subscribe();
  }

  /**
   * Update code graph from network props.
   */
  updateCodeGraph(): void {
    this.logger.trace("update graph from network");
    const left = 300;
    const width = 350;
    const space = 70;
    let codeNode: AbstractCodeNode;
    const nodes: AbstractCodeNode[] = [];

    // response
    const responseNode = this.graph.addNodeWithCoordinates(response, left + 2 * (width + space), 600);
    if (nodes.length > 0) {
      // nodes
      //   .filter((node: AbstractCodeNode) => node.outputs.events)
      //   .forEach((node: AbstractCodeNode) => {
      //     this.graph.addConnection(node.outputs.events, responseNode.inputs.events);
      //   });
    }

    this.graph.save();
  }
}
