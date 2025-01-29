// codeNodeTypes/basic

import { IBaklavaViewModel } from "baklavajs";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import dict from "./dict";
import listComprehension from "./listComprehension";
import number from "./number";
import range from "./range";
import response from "./response";
import text from "./text";
import { addBaseTypes } from "./interfaceTypes";

export const registerBaseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  addBaseTypes(codeGraphStore.viewModel as IBaklavaViewModel);

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(dict, { category: "base" });
  editor.registerNodeType(listComprehension, { category: "base" });
  editor.registerNodeType(number, { category: "base" });
  editor.registerNodeType(range, { category: "base" });
  editor.registerNodeType(response, { category: "base" });
  editor.registerNodeType(text, { category: "base" });
};
