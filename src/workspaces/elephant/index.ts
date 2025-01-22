// elephant/index.ts

import { Editor } from "baklavajs";

import { defineViewStore } from "@/stores/defineViewStore";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { IWorkspaceProps } from "../";
import iconSet from "./components/iconSet";
import route from "./routes";
import { elephantServerInit } from "./stores/backends/elephantServerStore";
import { registerElephantNodeTypes } from "./helpers/codeNodeTypes";
import { useElephantModelDBStore } from "./stores/model/modelDBStore";
import { useElephantModelStore } from "./stores/model/modelStore";
import { useElephantProjectDBStore } from "./stores/project/projectDBStore";
import { useElephantProjectStore } from "./stores/project/projectStore";

export const elephant: IWorkspaceProps = {
  backends: {},
  configNames: ["ElephantModel"],
  databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  iconSet,
  id: "elephant",
  init: () => {
    // Initialize stores
    const modelDBStore = useElephantModelDBStore();
    const projectDBStore = useElephantProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    const modelStore = useElephantModelStore();
    const projectStore = useElephantProjectStore();

    elephant.stores = {
      modelDBStore,
      modelStore,
      projectDBStore,
      projectStore,
    };

    elephant.backends = {
      elephant: elephantServerInit(),
    };

    elephant.views = {
      project: defineViewStore({
        name: "project",
        workspace: "elephant",
        views: {
          controller: "",
          main: "explore",
        },
      })(),
      model: defineViewStore({
        name: "model",
        workspace: "elephant",
        views: {
          controller: "",
          main: "explore",
        },
      })(),
    };

    const codeGraphStore = useCodeGraphStore();
    registerElephantNodeTypes(codeGraphStore.state.editor as Editor);
  },
  route,
  stores: {},
  theme: {
    "elephant-accent": "#fcbc0f",
    "elephant-logo": "#000080",
    elephant: "#f18619",
  },
  title: "Elephant",
  views: {},
};
