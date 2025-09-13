// pandas/interfaceTypes.ts

// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { BaklavaInterfaceTypes, NodeInterfaceType } from "@baklavajs/interface-types";

import { ICodeGraphViewModel } from "@/codeGraph/viewModel";

export interface IPandasDataFrame {}
export const dataframeType = new NodeInterfaceType<IPandasDataFrame>("dataframe");

export const addPandasTypes = (baklavaView: ICodeGraphViewModel) => {
  const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklavaView.editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(dataframeType);
};
