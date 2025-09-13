// codeGraph/index.ts

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";

import "@/codeGraph/codeGraph.scss";

import "./codeGraph.scss";

import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { addToolbarCommands } from "@/codeGraph/settings";

export const codeGraph = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    const viewModel = codeGraphStore.viewModel;

    addToolbarCommands(viewModel);
    registerCodeNodeTypes(viewModel, ["pandas", "plotly", "python"]);
  },
};
