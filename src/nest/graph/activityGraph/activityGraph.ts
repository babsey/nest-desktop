// activityGraphStore.ts

import { UnwrapRef, reactive } from "vue";

import { ILogObj, Logger } from "tslog";
import { logger as mainLogger } from "@/utils/logger";

import { ActivityAnimationGraph } from "@nest/graph/activityGraph/activityAnimationGraph";
import { ActivityChartGraph } from "@nest/graph/activityGraph/activityChartGraph";
import { ActivityChartPanelProps } from "@nest/graph/activityGraph/activityChart/activityChartPanel";
import { Project } from "@nest/core/project/project";

export class ActivityGraph {
  private _project: Project;
  private _activityChartGraph: ActivityChartGraph;
  private _activityAnimationGraph: ActivityAnimationGraph;
  private _state: UnwrapRef<any>;
  private _logger: Logger<ILogObj>;

  constructor(
    project: Project,
    activityGraph?: { panels: ActivityChartPanelProps[] }
  ) {
    this._project = project;
    this._activityChartGraph = new ActivityChartGraph(
      project,
      activityGraph?.panels
    );
    this._activityAnimationGraph = new ActivityAnimationGraph(project);
    this._logger = mainLogger.getSubLogger({
      name: `activity graph`,
    });

    this._state = reactive({
      codeHash: "",
      dataHash: "",
    });
  }

  get activityAnimationGraph(): ActivityAnimationGraph {
    return this._activityAnimationGraph;
  }

  get activityChartGraph(): ActivityChartGraph {
    return this._activityChartGraph;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Initialize activity graph.
   */
  init(): void {
    this.updateHash();
    this._logger.trace("init");

    this._activityChartGraph.init();
    // this.activityAnimationGraph.init();

    if (this._project.activities.state.hasSomeEvents) {
      this.update();
    }
  }

  /**
   * Serialize for JSON.
   * @return activity graph object
   */
  toJSON(): { panels: ActivityChartPanelProps[] } {
    return {
      panels: this._activityChartGraph ? this._activityChartGraph.toJSON() : [],
    };
  }

  /**
   * Update activity graph.
   */
  update(): void {
    // if (this.project.activities.state.hash === this.dataHash) return;

    this._activityChartGraph.update();
    // this.activityAnimationGraph.update();

    this.updateHash();
    this._logger.trace("update");
  }

  /**
   * Update hash for activity graph.
   */
  updateHash(): void {
    this._state.codeHash = this._project.simulation.code.state.hash;
    this._state.dataHash = this._project.activities.state.hash;
    this._logger.settings.name = `[${this._project.shortId}] activity graph #${this._state.odeHash} #${this._state.dataHash}`;
  }
}