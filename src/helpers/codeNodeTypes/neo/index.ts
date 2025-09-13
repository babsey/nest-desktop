// neo/codeNodeTypes

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

import neoSize from "./neoSize";
import neoSpikeTrain from "./neoSpikeTrain";

export const registerNeoNodeTypes = (viewModel: ICodeGraphViewModel) => {
  if (!viewModel) return;

  viewModel.state.modules["neo.core"] = "import neo";

  const editor = viewModel.editor;
  editor.registerNodeType(neoSpikeTrain, { category: "neo.core" });
  editor.registerNodeType(neoSize, { category: "neo" });
};
