// nest/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import nestConnect from "./nestConnect";
import nestCopyModel from "./nestCopyModel";
import nestCreate from "./nestCreate";
import nestInstall from "./nestInstall";
import nestPrepare from "./nestPrepare";
import nestResetKernel from "./nestResetKernel";
import nestSetKernelStatus from "./nestSetKernelStatus";
import nestSimulate from "./nestSimulate";

export const registerNESTNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["nest"] = "import nest";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(nestConnect, { category: "nest" });
  editor.registerNodeType(nestCopyModel, { category: "nest" });
  editor.registerNodeType(nestCreate, { category: "nest" });
  editor.registerNodeType(nestInstall, { category: "nest" });
  editor.registerNodeType(nestPrepare, { category: "nest" });
  editor.registerNodeType(nestResetKernel, { category: "nest" });
  editor.registerNodeType(nestSetKernelStatus, { category: "nest" });
  editor.registerNodeType(nestSimulate, { category: "nest" });
};
