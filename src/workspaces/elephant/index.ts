// elephant/index.ts

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import { defineViewStore } from "@/stores/defineViewStore";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import iconSet from "./components/iconSet";
import route from "./routes";
import { IWorkspaceProps } from "../";
import { elephantServerInit } from "./stores/backends/elephantServerStore";
import { useElephantModelDBStore } from "./stores/model/modelDBStore";
import { useElephantModelStore } from "./stores/model/modelStore";
import { useElephantProjectDBStore } from "./stores/project/projectDBStore";
import { useElephantProjectStore } from "./stores/project/projectStore";

export const elephant: IWorkspaceProps = {
  backends: {},
  databases: ["ELEPHANT_MODEL_STORE", "ELEPHANT_PROJECT_STORE"],
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
          main: "edit",
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
    const viewModel = codeGraphStore.viewModel as ICodeGraphViewModel;
    registerCodeNodeTypes(viewModel, ["elephant", "neo"]);
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
