// plotly/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import plotlyScatter from "./plotlyScatter";

export const registerPlotlyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["plotly"] = "import plotly";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(plotlyScatter, { category: "plotly" });
};
