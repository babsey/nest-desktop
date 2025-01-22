// baklava/index.ts

import { Editor } from "baklavajs";
import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import { BaklavaInterfaceTypes } from "@baklavajs/interface-types";

import { registerPythonNodeTypes } from "@/helpers/codeNodeTypes";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { stringType, numberType, booleanType } from "../../helpers/codeNodeTypes/interfaceTypes";

// import { Commands } from "@baklavajs/renderer-vue";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    registerPythonNodeTypes(codeGraphStore.state.editor as Editor);
  },
};

export const addBaseTypes = (baklavaView: IBaklavaViewModel) => {
  const editor = baklavaView.editor;

  const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(stringType, numberType, booleanType);
};

export const setSettings = (baklavaView: IBaklavaViewModel) => {
  baklavaView.settings.nodes.defaultWidth = 350;
  // baklavaView.settings.palette.enabled = false;

  // baklavaView.settings.contextMenu.additionalItems = [{ label: "edit", command: Commands.OPEN_SIDEBAR_COMMAND }];
};
