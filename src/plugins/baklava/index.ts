// baklava/index.ts

import { Editor } from "baklavajs";
import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import { BaklavaInterfaceTypes } from "@baklavajs/interface-types";

import { registerNumpyNodeTypes } from "@/helpers/codeNodeTypes/numpy";
import { registerPandasNodeTypes } from "@/helpers/codeNodeTypes/pandas";
import { registerPlotlyNodeTypes } from "@/helpers/codeNodeTypes/plotly";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { stringType, numberType, booleanType } from "../../helpers/codeNodeTypes/interfaceTypes";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    addBaseTypes(codeGraphStore.viewModel as IBaklavaViewModel);
    setViewSettings(codeGraphStore.viewModel as IBaklavaViewModel);
    registerNumpyNodeTypes(codeGraphStore.viewModel.editor as Editor);
    registerPandasNodeTypes(codeGraphStore.viewModel.editor as Editor);
    registerPlotlyNodeTypes(codeGraphStore.viewModel.editor as Editor);
  },
};

export const addBaseTypes = (baklavaView: IBaklavaViewModel) => {
  const editor = baklavaView.editor;

  const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(stringType, numberType, booleanType);
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
