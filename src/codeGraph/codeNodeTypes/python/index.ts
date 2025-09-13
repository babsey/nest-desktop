// codeNodeTypes/python

import { ICodeGraphViewModel } from "../../viewModel";

import len from "./len";
import listComprehension from "./listComprehension";
import range from "./range";
import zip from "./zip";

const category = ".python";

export const registerPythonNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  const editor = viewModel.editor;
  editor.registerNodeType(len, { category });
  editor.registerNodeType(listComprehension, { category });
  editor.registerNodeType(range, { category });
  editor.registerNodeType(zip, { category });
};
