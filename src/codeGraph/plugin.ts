// codeGraph/plugin.ts

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";

import "./codeGraph.scss";

import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

import { addToolbarCommands } from "@/codeGraph/settings";
import { useCodeGraph } from "./viewModel";

export const codeGraph = {
  async install() {
    const viewModel = useCodeGraph();

    addToolbarCommands(viewModel);
    registerCodeNodeTypes(viewModel, ["python"]);
  },
};
