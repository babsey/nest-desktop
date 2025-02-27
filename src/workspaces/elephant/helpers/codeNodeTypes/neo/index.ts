// elephant/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import neoSpikeTrain from "./neoSpikeTrain";
import neoSpikeTimes from "./neoSpikeTimes";

export const registerNeoNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["neo"] = "import neo";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(neoSpikeTimes, { category: "neo" });
  editor.registerNodeType(neoSpikeTrain, { category: "neo.core" });
};
