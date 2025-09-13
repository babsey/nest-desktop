// pynn/index.ts

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import { defineViewStore } from "@/stores/defineViewStore";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import iconSet from "./components/iconSet";
import route from "./routes";
import { IWorkspaceProps } from "../";
import { pynnSimulatorInit } from "./stores/backends/pynnSimulatorStore";
import { usePyNNModelDBStore } from "./stores/model/modelDBStore";
import { usePyNNModelStore } from "./stores/model/modelStore";
import { usePyNNProjectDBStore } from "./stores/project/projectDBStore";
import { usePyNNProjectStore } from "./stores/project/projectStore";

export const pynn: IWorkspaceProps = {
  backends: {},
  configNames: ["PyNNModel"],
  databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  iconSet,
  id: "pynn",
  init: () => {
    // Initialize stores
    const modelDBStore = usePyNNModelDBStore();
    const projectDBStore = usePyNNProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    const modelStore = usePyNNModelStore();
    const projectStore = usePyNNProjectStore();

    pynn.stores = {
      modelDBStore,
      modelStore,
      projectDBStore,
      projectStore,
    };

    pynn.backends = {
      pynn: pynnSimulatorInit(),
    };

    pynn.views = {
      project: defineViewStore({
        name: "project",
        workspace: "pynn",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
      model: defineViewStore({
        name: "model",
        workspace: "pynn",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
    };

    const codeGraphStore = useCodeGraphStore();
    const viewModel: ICodeGraphViewModel = codeGraphStore.viewModel as ICodeGraphViewModel;
    registerCodeNodeTypes(viewModel, ["pynn"]);
  },
  route,
  stores: {},
  theme: {
    "pynn-accent": "#e6007e",
    "pynn-logo": "#0F9959",
    pynn: "#0F9959",
  },
  title: "PyNN",
  views: {},
};
