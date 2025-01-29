// baklava/index.ts

import { Editor } from "baklavajs";
import { IBaklavaViewModel } from "@baklavajs/renderer-vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    setViewSettings(codeGraphStore.viewModel as IBaklavaViewModel);
    registerCodeNodeTypes(["base", "numpy", "pandas", "plotly"]);
  },
};

export const setViewSettings = (baklavaView: IBaklavaViewModel) => {
  baklavaView.settings.nodes.defaultWidth = 350;
  // baklavaView.settings.palette.enabled = false;

  // baklavaView.settings.contextMenu.additionalItems = [{ label: "edit", command: Commands.OPEN_SIDEBAR_COMMAND }];
};

export const subscribe = (editor: Editor, call: () => void) => {
  editor.graphEvents.addNode.subscribe(Symbol(), () => call());
  editor.graphEvents.addConnection.subscribe(Symbol(), () => call());
  editor.graphEvents.removeNode.subscribe(Symbol(), () => call());
  editor.graphEvents.removeConnection.subscribe(Symbol(), () => call());
};
