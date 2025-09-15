// plugin.ts

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";

import "./codeGraph.scss";

import { addToolbarCommands } from "./settings";
import { registerDefaultNodeTypes, registerPythonNodeTypes } from "./codeNodeTypes";
import { useCodeGraph } from "./viewModel";

export const codeGraph = {
  async install() {
    const viewModel = useCodeGraph();

    // add commands in toolbar
    addToolbarCommands(viewModel);

    // register node types
    registerDefaultNodeTypes(viewModel);
    registerPythonNodeTypes(viewModel);
  },
};
