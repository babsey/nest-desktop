// codeNodeTypes/index.ts

import { Editor } from "baklavajs";

import numpyCorrelation from "./numpyCorrelation";
import pandasDataFrame from "./pandasDataFrame";
import plotlyScatter from "./plotlyScatter";

export const registerPythonNodeTypes = (editor: Editor) => {
  editor.registerNodeType(numpyCorrelation, { category: "numpy" });
  editor.registerNodeType(pandasDataFrame, { category: "pandas" });
  editor.registerNodeType(plotlyScatter, { category: "plotly" });
};
