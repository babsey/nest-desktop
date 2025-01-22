// project.ts

import { BaseProject, IBaseProjectProps } from "@/helpers/project/project";

// import { ElephantAnalysisCode } from "../analysis/analysisCode";
import { ElephantCode } from "../code/code";
import { useElephantModelDBStore } from "../../stores/model/modelDBStore";

export class ElephantProject extends BaseProject {
  constructor(projectProps: IBaseProjectProps = {}) {
    super(projectProps);
  }

  override get Code() {
    return ElephantCode;
  }

  override get code(): ElephantCode {
    return this._code as ElephantCode;
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable.
   */
  override clone(): ElephantProject {
    this.logger.trace("clone");

    return new ElephantProject({
      ...this.toJSON(),
      id: undefined,
      updatedAt: "",
    });
  }

  /**
   * Initialize model store for Elephant.
   */
  override initModelStore(): void {
    this.modelDBStore = useElephantModelDBStore();
  }
}
