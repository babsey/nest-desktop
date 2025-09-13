// codeNodeTypes/default

import { ICodeGraphViewModel } from "../../viewModel";

import { addDefaultTypes } from "./interfaceTypes";
export { booleanType, dictType, listType, nodeType, numberType, stringType } from "./interfaceTypes";

import add from "./add";
import apply from "./apply";
import comment from "./comment";
import dict from "./dict";
import functionNode from "./function";
import list from "./list";
import modifyListElement from "./modifyListElement";
import number from "./number";
import text from "./text";

export const registerDefaultNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  addDefaultTypes(viewModel as ICodeGraphViewModel);

  const editor = viewModel.editor;
  editor.registerNodeType(add);
  editor.registerNodeType(number);
  editor.registerNodeType(text);
  editor.registerNodeType(apply);
  editor.registerNodeType(comment);
  editor.registerNodeType(functionNode);
  editor.registerNodeType(dict);
  editor.registerNodeType(list);
  editor.registerNodeType(modifyListElement);
};
