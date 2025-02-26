// codeNodeTypes/plotly

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import plotlyBar from "./plotlyBar";
import plotlyDataResponse from "./plotlyDataResponse";
import plotlyFigure from "./plotlyFigure";
import plotlyFigureAddTrace from "./plotlyFigureAddTrace";
import plotlyHeatmap from "./plotlyHeatmap";
import plotlyMakeSubplots from "./plotlyMakeSubplots";
import plotlyScatter from "./plotlyScatter";

export const registerPlotlyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["plotly"] = "import plotly";
  codeGraphStore.state.modules["plotly.graph_objects"] = "import plotly.graph_objects as go";
  codeGraphStore.state.modules["plotly.subplots"] = "import plotly.subplots as sp";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(plotlyBar, { category: "plotly.graph_objects" });
  editor.registerNodeType(plotlyDataResponse, { category: "plotly" });
  editor.registerNodeType(plotlyFigure, { category: "plotly.graph_objects" });
  editor.registerNodeType(plotlyFigureAddTrace, { category: "plotly" });
  editor.registerNodeType(plotlyHeatmap, { category: "plotly.graph_objects" });
  editor.registerNodeType(plotlyMakeSubplots, { category: "plotly.subplots" });
  editor.registerNodeType(plotlyScatter, { category: "plotly.graph_objects" });
};
