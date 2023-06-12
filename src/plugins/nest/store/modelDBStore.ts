// modelDBStore.ts
import { defineStore } from "pinia";

import { Model } from "../core/model/model";
import { ModelDB } from "../core/model/modelDB";

const modelAssets = [
  "voltmeter",
  "step_current_generator",
  "static_synapse",
  "spike_recorder",
  "spike_generator",
  "poisson_generator",
  "parrot_neuron",
  "noise_generator",
  "multimeter",
  "iaf_psc_alpha",
  "iaf_cond_alpha",
  "hh_psc_alpha",
  "dc_generator",
  "ac_generator",
];

export const useModelDBStore = defineStore("model-db", {
  state: () => ({
    db: new ModelDB(),
    models: [] as Model[],
  }),
  getters: {
    recentModelId: (state) =>
      state.models.length > 0 ? state.models[0].id : undefined,
  },
  actions: {
    /**
     * Delete model object from the database and then list model.
     */
    async deleteModel(modelId: string): Promise<any> {
      return this.db.deleteModel(modelId).then(() => {
        this.updateList();
      });
    },
    /**
     * Get model from the model list.
     */
    getModel(modelId: string): Model {
      return (
        this.models.find((model: Model) => model.id === modelId) ||
        new Model({ id: modelId, params: [] })
      );
    },
    /**
     * Get models by elementType
     */
    getModels(elementType: string): Model[] {
      return this.models.filter(
        (model: Model) => model.elementType === elementType
      );
    },
    /**
     * Check if model list has model.
     */
    hasModel(modelId: string): boolean {
      return this.models.some((model: any) => model.id === modelId);
    },
    /**
     * Import multiple models from assets and add them to the database.
     */
    async importModelsFromAssets(): Promise<any> {
      // console.log("Import models from assets");
      let promise: Promise<any> = Promise.resolve();
      modelAssets.forEach(async (file: string) => {
        console.log(file);
        const response = await fetch("/assets/nest/models/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => this.db.addModel(data));
      });
      return promise;
    },
    /**
     * Initialize model db.
     */
    async init(): Promise<any> {
      // console.log("Initialize model DB store");
      return this.db.count().then(async (count: number) => {
        console.debug("Models in db: " + count);
        if (count === 0) {
          return this.importModelsFromAssets().then(() => this.updateList());
        } else {
          return this.updateList();
        }
      });
    },
    /**
     * Reset database and then initialize.
     */
    async resetDatabase(): Promise<any> {
      // console.debug("Reset model database");
      await this.db.reset().then(() => this.init());
    },
    /**
     * Save model object to the database.
     */
    async saveModel(model: Model): Promise<any> {
      return this.db.importModel(model);
    },
    /**
     * Update model list from the database.
     */
    async updateList(): Promise<any> {
      // console.log("Update models list");
      this.models = [];
      return this.db.list("id").then((models: any[]) => {
        // this.models = models;
        models.forEach((model) => this.models.push(new Model(model)));

        // if (this.projects.length === 0) {
        //   this._view.redirect();
        // }

        // Redirect if project id from the current route is provided in the list.
        // const currentRoute = this._app.vueSetupContext.root.$router.currentRoute;

        // if (currentRoute.name === 'projectId') {
        //   this.project =
        //     this.getProject(currentRoute.params.id) ||
        //     this.getProject(this.recentProjectId);
        //   this._view.redirect(this._view.state.projectId);
        // }
      });
    },
  },
});
