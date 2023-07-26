// projectStore.ts

import { defineStore } from "pinia";

import { logger as mainLogger } from "@/utils/logger";
import router from "@/router";

import { Project } from "@nest/core/project/project";
import { useProjectDBStore } from "./projectDBStore";
// import { useActivityGraphStore } from "../graph/activityGraphStore";

const logger = mainLogger.getSubLogger({ name: "project store" });

export const useProjectStore = defineStore("project-view", {
  state: () => ({
    bottomOpen: false,
    controllerOpen: false,
    controllerView: "",
    project: new Project(),
    projectId: "",
    simulateAfterCheckout: false,
    view: "edit",
    controllerWidth: 480,
    bottomNavHeight: 200,
    controllerItems: [
      { id: "network", icon: "nest:network", title: "Edit network" },
      { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
      { id: "raw", icon: "mdi-code-json" },
      { id: "code", icon: "mdi-xml" },
      { id: "activity", icon: "mdi-border-style" },
      { id: "stats", icon: "mdi-table-large" },
    ],
    code: "import nest\n\nnest.ResetKernel()\n\nn1 = nest.Create('iaf_psc_alpha')\ndc1 = nest.Create('dc_generator')\nvm1 = nest.Create('voltmeter')\n\nnest.Connect(dc1, n1)\nnest.Connect(vm1, n1)\n\nnest.Simulate(1000)",
  }),
  actions: {
    /**
     * Load current project from store.
     * @param projectId
     */
    loadProject(projectId: string = ""): void {
      logger.trace("load project:", projectId?.slice(0, 6));
      const projectDBStore = useProjectDBStore();
      this.project = projectDBStore.getProject(projectId);
      this.projectId = this.project.id;

      // this.project.activityGraph.init();

      // const activityGraphStore = useActivityGraphStore();
      // activityGraphStore.init(this.project as Project);
      // activityGraphStore.update();
    },
    /**
     * Start simulation of the current project.
     */
    startSimulation(): void {
      logger.trace("start simulation:", this.projectId?.slice(0, 6));
      router.push({
        name: "ActivityExplorer",
        params: { projectId: this.projectId },
      });
      this.project.startSimulation();
    },
    /**
     * Reload the project in the list.
     */
    reloadProject(project: Project): void {
      logger.trace("reload project:", project.id.slice(0, 6));
      const projectDBStore = useProjectDBStore();
      projectDBStore.unloadProject(project.id);
      this.project = projectDBStore.getProject(project.id);
    },
    /**
     * Save current project.
     */
    saveCurrentProject() {
      logger.trace("Save project:", this.projectId?.slice(0, 6));
      const projectDBStore = useProjectDBStore();
      projectDBStore.saveProject(this.projectId);
    },
    /**
     * Toggle navigation drawer.
     * @param item
     */
    toggleController(item?: any) {
      logger.trace("toggle controller:", item.id);
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
    },
  },
});