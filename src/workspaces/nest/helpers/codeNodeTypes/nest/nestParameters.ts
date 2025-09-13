// nestParameters.ts

import {
  CheckboxInterface,
  IntegerInterface,
  NodeInterface,
  TextInputInterface,
  displayInSidebar,
  setType,
} from "baklavajs";
import {
  AbstractCodeNode,
  NodeOutputInterface,
  booleanType,
  defineDynamicCodeNode,
  formatInterfaceLabel,
  formatInterfaceLabels,
  getPositionBeforeNode,
  numberType,
  stringType,
} from "@/codeGraph";

import { CodeGraph } from "@/helpers/code/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import { TParameter } from "@/types";

import nestParameters from "./nestParameters";
import { INESTNodeCollection } from "./interfaceTypes";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { addNESTRandomNormal } from "./nestRandomNormal";
import { addNESTRandomUniform } from "./nestRandomUniform";

interface IParam extends IParamProps {
  hidden?: boolean;
}

type TRandomTypes = "uniform" | "normal";

const randomTypes: Record<TRandomTypes, (graph: CodeGraph | NESTCodeGraph, idx?: number) => AbstractCodeNode> = {
  uniform: addNESTRandomUniform,
  normal: addNESTRandomNormal,
};

export default defineDynamicCodeNode({
  type: "nest/Parameters",
  title: "parameters",
  variableName: "p",
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const params: string[] = [];

    if (this.node.inputs)
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!this.node) return;
        const paramInterface = this.node.inputs[key];
        if (paramInterface.hidden) return;
        const outputInterface = this.node.getConnectedOutputInterfaceByInterface(key);
        if (outputInterface != undefined) params.push(`"${key}": ${formatInterfaceLabel(outputInterface)}`);
        else params.push(`"${key}": ${paramInterface.value}`);
      });

    if (params.length === 0) return "{}";
    return `{\n\t${params.join(",\n\t")}\n}`;
  },
  onUpdate() {
    if (!this.node) return {};

    const inputs: Record<string, () => NodeInterface> = {};

    if (this.node.view?.paramsAll) {
      const params = this.node.view.paramsAll as TParameter[];
      const paramVisible = this.node.state.props ? this.node.state.props?.map((prop) => prop.id) : [];

      params.forEach((param: TParameter) => {
        const paramJSON = param.toJSON() as IParam;
        const paramProps = this.node?.state.props?.find((paramProps: IParamProps) => paramProps.id == param.id);
        if (paramProps) paramJSON.value = paramProps.value;
        paramJSON.hidden = !paramVisible.includes(param.id);
        inputs[param.id] = () => createParameterInterface(paramJSON);
      });
    }

    return { inputs };
  },
  toJSON() {
    if (!this.node) return {};
    const props: Record<string, unknown> = {};

    if (this.node && this.node.inputs)
      Object.entries(this.node.inputs).forEach((input: [string, NodeInterface]) => {
        const paramValues = this.node.getConnectedOutputInterfacesByInterface(input[0]);
        if (paramValues.length > 0) props[input[0]] = formatInterfaceLabels(paramValues).join(", ");
        else if (!input[1].hidden) props[input[0]] = input[1].value;
      });

    return props;
  },
});

export const addNESTParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  position: { x: number; y: number } = { x: 0, y: 0 },
  props: IParamProps[] = [],
): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(nestParameters, position, props);
  codeNode.state.integrated = true;
  return codeNode;
};

export const cleanNESTParameterNode = (paramsNode: AbstractCodeNode, nodeView: unknown): void => {
  if (!nodeView) return;

  nodeView.codeNodes.params = paramsNode;
  nodeView.paramsAll.forEach((param) => (param.codeNodes.node = paramsNode));

  if (!paramsNode.view) paramsNode.view = nodeView;
  paramsNode.onUpdate();
};

export const createParameterInterface = (param: IParam): NodeInterface => {
  let paramInterface;

  if (typeof param.value == "number") {
    paramInterface = new IntegerInterface(param.id, param.value as number).use(setType, numberType);
  } else if (typeof param.value == "boolean") {
    paramInterface = new CheckboxInterface(param.id, param.value as boolean).use(setType, booleanType);
  } else {
    paramInterface = new TextInputInterface(param.id, JSON.stringify(param.value)).use(setType, stringType);
  }

  paramInterface.use(displayInSidebar, true);
  paramInterface.setHidden(param.hidden ?? false);

  return paramInterface;
};

export const updateNESTParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  codeNode: AbstractCodeNode,
  paramInterfaceName: string = "params",
  paramsProps: IParamProps[] = [],
): AbstractCodeNode | undefined => {
  let paramsNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface(paramInterfaceName, "inputs");

  if (paramsProps.length === 0) {
    if (paramsNode) paramsNode.remove();
    return;
  } else if (!paramsNode) {
    const position = getPositionBeforeNode(codeNode);
    paramsNode = addNESTParameterNode(graph, position, paramsProps);
  }
  paramsNode.state.props = paramsProps;

  if (!graph.hasConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]))
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]);

  return paramsNode;
};

export const updateNESTParameterInterface = (
  graph: CodeGraph | NESTCodeGraph,
  codeNode: AbstractCodeNode,
  paramId: string,
  randomType?: TRandomTypes,
): AbstractCodeNode | null => {
  let randomNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface(paramId, "inputs");

  if (randomNode && !randomNode.type.includes(randomType)) randomNode.remove();

  if (!randomNode && randomType) {
    randomNode = randomTypes[randomType](graph, graph.nodes.indexOf(codeNode));
    graph.addConnection(randomNode.outputs.out, codeNode.inputs[paramId]);
  }

  codeNode.view.params[paramId].state.random = randomType != undefined;

  return randomNode;
};
