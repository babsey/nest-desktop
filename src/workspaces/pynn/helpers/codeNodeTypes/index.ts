// codeNodeTypes/index.ts

import { Editor } from "baklavajs";

import pynnRun from "./pynnRun";

export const registerPyNNNodeTypes = (editor: Editor) => {
  editor.registerNodeType(pynnRun, { category: "pynn" });
};
