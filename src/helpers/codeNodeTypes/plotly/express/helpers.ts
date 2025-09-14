import type { AbstractCodeNode } from "@/codeGraph";

export const getPlotlyExpressArgs = (codeNode: AbstractCodeNode): string[] => {
  if (!codeNode || !codeNode.node) return [];
  const args: string[] = [];

  const dataFrame = codeNode.node.getConnectedNodesByInterface("data_frame");
  if (dataFrame.length > 0) args.push(`${codeNode.code?.graph.formatLabels(dataFrame).join(", ")}`);

  const x = codeNode.node.getConnectedNodesByInterface("x");
  if (x.length > 1) args.push(`x=[${codeNode.code?.graph.formatLabels(x).join(", ")}]`);
  else if (x.length > 0) args.push(`x=${codeNode.code?.graph.formatLabels(x).join(", ")}`);
  else if (codeNode.node.inputs.x.value) args.push(`x="${codeNode.node.inputs.x.value}"`);

  const y = codeNode.node.getConnectedNodesByInterface("y");
  if (y.length > 1) args.push(`y=[${codeNode.code?.graph.formatLabels(y).join(", ")}]`);
  else if (y.length > 0) args.push(`y=${codeNode.code?.graph.formatLabels(y).join(", ")}`);
  else if (codeNode.node.inputs.y.value) args.push(`y="${codeNode.node.inputs.y.value}"`);

  return args;
};

export const getPlotlyGraphObjectsArgs = (codeNode: AbstractCodeNode): string[] => {
  if (!codeNode || !codeNode.node) return [];
  const args: string[] = [];

  const x = codeNode.node.getConnectedNodesByInterface("x");
  if (x.length > 1) args.push(`x=[${codeNode.code?.graph.formatLabels(x).join(", ")}]`);
  else if (x.length > 0) args.push(`x=${codeNode.code?.graph.formatLabels(x).join(", ")}`);
  else if (codeNode.node.inputs.x.value) args.push(`x="${codeNode.node.inputs.x.value}"`);

  const y = codeNode.node.getConnectedNodesByInterface("y");
  if (y.length > 1) args.push(`y=[${codeNode.code?.graph.formatLabels(y).join(", ")}]`);
  else if (y.length > 0) args.push(`y=${codeNode.code?.graph.formatLabels(y).join(", ")}`);
  else if (codeNode.node.inputs.y.value) args.push(`y="${codeNode.node.inputs.y.value}"`);

  return args;
};
