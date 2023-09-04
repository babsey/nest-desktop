// nestProject.ts

import { v4 as uuidv4 } from "uuid";

import { BaseProject, ProjectProps } from "@/components/project/baseProject";

import { useNESTModelDBStore } from "@nest/store/model/nestModelDBStore";
import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";
import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";

import { Insite } from "../insite/insite";
import { NESTNetwork, NESTNetworkProps } from "../../components/network/nestNetwork";
import {
  NESTSimulation,
  NESTSimulationProps,
} from "../simulation/nestSimulation";

export interface NESTProjectProps extends ProjectProps {
  network?: NESTNetworkProps;
}

export class NESTProject extends BaseProject {
  private _insite: Insite; // insite

  constructor(project: NESTProjectProps = {}) {
    super(project);
    this._insite = new Insite(this);
  }

  get insite(): Insite {
    return this._insite;
  }

  override get network(): NESTNetwork {
    return this.baseNetwork as NESTNetwork;
  }

  override get simulation(): NESTSimulation {
    return this.baseSimulation as NESTSimulation;
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  override clone(): NESTProject {
    this.logger.trace("clone");
    const newProject = new NESTProject({ ...this.toJSON() });
    newProject.id = uuidv4();
    newProject.updatedAt = "";
    newProject.init();
    return newProject;
  }

  /**
   * Clone this current project and add it to the list.
   *
   * @remarks
   * It pushes new project to the first line of the list.
   */
  override duplicate(): NESTProject {
    this.logger.trace("duplicate");
    const newProject: NESTProject = this.clone();
    this.projectDBStore.addProject(newProject);
    return newProject;
  }

  /**
   * Initialize store for NEST.
   */
  override initStore(): void {
    this.modelStore = useNESTModelDBStore();
    this.projectDBStore = useNESTProjectDBStore();
    this.projectStore = useNESTProjectStore();
  }

  override newNetwork(data?: NESTNetworkProps): NESTNetwork {
    return new NESTNetwork(this, data);
  }



  override newSimulation(data?: NESTSimulationProps): NESTSimulation {
    return new NESTSimulation(this, data);
  }
}
