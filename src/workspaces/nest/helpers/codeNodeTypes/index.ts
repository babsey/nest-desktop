// codeNodeTypes/index.ts

import { Editor } from "baklavajs";

import nestConnect from "./nestConnect";
import nestCopyModel from "./nestCopyModel";
import nestCreate from "./nestCreate";
import nestResetKernel from "./nestResetKernel";
import nestSetKernelStatus from "./nestSetKernelStatus";
import nestSimulate from "./nestSimulate";

export const registerNESTNodeTypes = (editor: Editor) => {
  editor.registerNodeType(nestConnect, { category: "nest" });
  editor.registerNodeType(nestCopyModel, { category: "nest" });
  editor.registerNodeType(nestCreate, { category: "nest" });
  editor.registerNodeType(nestResetKernel, { category: "nest" });
  editor.registerNodeType(nestSetKernelStatus, { category: "nest" });
  editor.registerNodeType(nestSimulate, { category: "nest" });
};
