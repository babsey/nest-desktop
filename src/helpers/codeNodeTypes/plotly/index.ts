// codeNodeTypes/plotly

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import plotlyBar from "./plotlyBar";
import plotlyFigure from "./plotlyFigure";
import plotlyFigureAddTrace from "./plotlyFigureAddTrace";
import plotlyHeatmap from "./plotlyHeatmap";
import plotlyLine from "./plotlyLine";
import plotlyMakeSubplots from "./plotlyMakeSubplots";
import plotlyScatter from "./plotlyScatter";

export const registerPlotlyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["plotly"] = "import plotly";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(plotlyBar, { category: "plotly" });
  editor.registerNodeType(plotlyFigure, { category: "plotly" });
  editor.registerNodeType(plotlyFigureAddTrace, { category: "plotly" });
  editor.registerNodeType(plotlyHeatmap, { category: "plotly" });
  editor.registerNodeType(plotlyLine, { category: "plotly" });
  editor.registerNodeType(plotlyMakeSubplots, { category: "plotly" });
  editor.registerNodeType(plotlyScatter, { category: "plotly" });
};
