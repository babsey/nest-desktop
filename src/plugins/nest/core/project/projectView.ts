// projectView.ts

import { reactive, UnwrapRef } from "vue";
// import VueRouter from 'vue-router';

import { App } from "../app";
import { Config } from "@/helpers/config";
import { Project } from "./project";

export class ProjectView extends Config {
  private _app: App;
  private _state: UnwrapRef<any>;
  private _tools: any[] = [
    {
      icon: "$network",
      minWidth: 440,
      name: "networkParamEdit",
      title: "Network",
      width: 440,
    },
    {
      icon: "mdi-engine-outline",
      minWidth: 440,
      name: "simulationKernel",
      title: "Kernel",
      width: 440,
    },
    {
      icon: "mdi-database",
      minWidth: 575,
      name: "docJSON",
      title: "Doc",
      devMode: true,
      width: 575,
    },
    {
      icon: "mdi-code-braces",
      minWidth: 575,
      name: "dataJSON",
      title: "Data",
      devMode: true,
      width: 575,
    },
    {
      icon: "mdi-xml",
      minWidth: 575,
      name: "codeEditor",
      title: "Code",
      width: 575,
    },
    {
      icon: "mdi-tune-variant", //'mdi-chart-scatter-plot'
      minWidth: 440,
      name: "activityEdit",
      title: "Activity",
      width: 440,
    },
    {
      icon: "mdi-table-large",
      minWidth: 510,
      name: "activityStats",
      title: "Stats",
      width: 510,
    },
  ];

  constructor(app: App) {
    super("ProjectView");
    this._app = app;

    // Global state for project view.
    this._state = reactive({
      activityGraph: "abstract",
      modeIdx: 0,
      networkGraphHeight: "calc(100vh - 48px)",
      project: new Project(),
      projectId: "",
      refreshIntervalId: undefined,
      tool: undefined,
      toolOpened: false,
      toast: {
        message: "",
        pauseOnHover: true,
        position: "top-right",
        type: "success",
      },
    });
  }

  get app(): App {
    return this._app;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get tools(): any[] {
    return this._tools;
  }

  /**
   * Count networks after the current.
   */
  countAfter(): number {
    return (
      this._state.project.networkRevisions.length -
      this._state.project.networkRevisionIdx -
      1
    );
  }

  /**
   * Count networks before the current.
   */
  countBefore(): number {
    return this._state.project.networkRevisionIdx;
  }

  /**
   * Initialize project view.
   */
  async init(projectId: String = ""): Promise<any> {
    console.log(projectId);
    if (projectId.length > 0) {
      this._state.projectId = projectId;
    }

    if (this._state.projectId != null) {
      console.log("Initialize project: " + this._state.projectId.slice(0, 6));
    }

    return this._app.project.initProject(this._state.projectId).then(() => {
      if (this._state.project) {
        const generateCode =
          this._state.project.simulation.code.state.runSimulationInsite !==
          this._state.project.simulation.code.state.codeInsite;
        this._state.project.init({
          generateCode,
        });

        // Update view mode for project.
        this.updateProjectMode();

        // Update activity graph view.
        this._state.activityGraph = this._state.project.network.hasPositions
          ? this._state.activityGraph
          : "abstract";

        this.update();

        // Run simulation if allowed.
        if (
          this.config.simulateAfterLoad &&
          this._state.modeIdx === 1 &&
          this._state.project.simulation.code.hash !==
            this._state.project.activityGraph.codeHash
        ) {
          this._state.project.runSimulation();
        }
      }
    });
  }

  /**
   * Redirects the page content to the project. If
   * no one was chosen before, the first one is selected.
   * Please beware: The route IDs used in this class are the ones in the
   * array, which might not contain every route from the Vue router!
   */
  redirect(projectId: string = ""): void {
    if (projectId == undefined || projectId.length === 0) {
      // Get stated project ID when it is not defined.
      projectId =
        this._state.projectId != null &&
        this._app.project.state.projects.find(
          (project: Project) => project.id === this._state.projectId
        )
          ? this._state.projectId
          : this._app.project.recentProjectId;
    } else if (
      // Get recent project ID when defined project ID is not found.
      !this._app.project.state.projects.find(
        (project: Project) => project.id === projectId
      )
    ) {
      projectId = this._app.project.recentProjectId;
    }

    // const router: VueRouter = this._app.vueSetupContext.root.$router;
    // if (router.currentRoute.params.id !== projectId) {
    //   // Check if the page is already loaded to avoid "Avoided redundant
    //   // navigation" error.
    //   router.push({
    //     name: 'projectId',
    //     params: { id: projectId },
    //   });
    // }
  }

  /**
   * Set height for network graph.
   */
  resizeNetworkGraph(): void {
    console.debug("Resize network graph");

    // Caluclate height for network graph.
    this._state.networkGraphHeight =
      this._state.modeIdx === 2 ? "calc(30vh)" : "calc(100vh - 48px)";

    // Call resize event.
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1);
  }

  /**
   * Select view for activity graph.
   */
  selectActivityGraph(mode: string): void {
    console.debug("Select activity graph");

    this._state.activityGraph = mode;
    this._state.modeIdx = 1;
  }

  /**
   * Select tool for this project.
   */
  selectTool(tool: any): void {
    console.debug("Select project tool");

    // Open tool if closed or select other tool.
    this._state.toolOpened = this._state.toolOpened
      ? this._state.tool !== tool
      : true;
    // Set project tool.
    this._state.tool = tool;
  }

  showActivityExplorer(): void {
    this._state.modeIdx = 1;
  }

  /**
   * Update project view.
   */
  update(): void {
    this._state.project.network.networkChanges();
    this._state.project.activityGraph.update();
  }

  /**
   * Update view mode of the project.
   */
  updateProjectMode(): void {
    console.debug("Update project view");

    // Select tool and resize network graph
    // if network editor or lab view is selected.
    if ([0, 2].includes(this._state.modeIdx)) {
      this._state.toolOpened = this._state.toolOpened
        ? this._state.modeIdx !== 2
        : this._state.toolOpened;
      this.resizeNetworkGraph();
    }

    // Run simulation if allowed.
    if (
      this.config.simulateAfterLoad &&
      this._state.modeIdx === 1 &&
      this._state.project.simulation.code.hash !==
        this._state.project.activityGraph.codeHash
    ) {
      this._state.project.runSimulation();
    }
  }
}
