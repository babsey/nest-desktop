// BaseCodeGraph.ts

import toposort from "toposort";
import {
  AbstractNode,
  Connection,
  Graph,
  IBaklavaViewModel,
  IEditorState,
  INodeState,
  NodeInterface,
  useBaklava,
} from "baklavajs";
import { v4 as uuidv4 } from "uuid";

import { setViewSettings } from "@/plugins/baklava";

import { AbstractCodeNode } from "./codeNode";
import { CodeNodeInterface } from "./interface/codeNodeInterface";

interface IPosition {
  x: number;
  y: number;
}

export class BaseCodeGraph {
  private _uuid: string;
  private _viewModel: IBaklavaViewModel;

  constructor() {
    this._uuid = uuidv4();

    this._viewModel = useBaklava();
    setViewSettings(this._viewModel);
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this) as AbstractCodeNode[];
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  get graph(): Graph {
    return this.viewModel.displayedGraph as Graph;
  }

  get nodeIds(): string[] {
    return this.nodes.map((node: AbstractCodeNode) => node.id);
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values;
  }

  get nodeCodes(): string[] {
    return this.nodes.map((node: AbstractCodeNode) => node.script);
  }

  get nodesSegregated(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.integrated) as AbstractCodeNode[];
  }

  get uuid(): string {
    return this._uuid;
  }

  get viewModel(): IBaklavaViewModel {
    return this._viewModel as IBaklavaViewModel;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.hidden) as AbstractCodeNode[];
  }

  /**
   * Add code node to graph.
   * @param node code node
   */
  addNode(node: AbstractCodeNode): AbstractCodeNode | undefined {
    return this.graph.addNode(node as AbstractNode) as AbstractCodeNode;
  }

  /**
   * Add code node at coordinates.
   * @param nodeType
   * @param position
   * @param props optional
   * @returns code node
   */
  addNodeAtCoordinates = (
    nodeType: new () => AbstractCodeNode,
    position: IPosition = { x: 0, y: 0 },
    props?: unknown,
  ): AbstractCodeNode => {
    const node = new nodeType();
    if (props) node.state.props = props;

    this.addNode(node);
    if (node.position) node.position = position;

    return node;
  };

  /**
   * Add connection of code nodes
   * @param from code node interface
   * @param to code node interface
   */
  addConnection(from: CodeNodeInterface | NodeInterface, to: CodeNodeInterface | NodeInterface): void {
    if (from.type !== "node") from.hidden = false;
    if (to.type !== "node") to.hidden = false;
    this.graph.addConnection(from, to);
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.unsubscribe();
    this.graph._nodes = [];
    this.graph._connections = [];
    this.subscribe();
  }

  findNodeById(id: string): AbstractCodeNode | undefined {
    return this.graph.findNodeById(id) as AbstractCodeNode | undefined;
  }

  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return this.codeNodes.find((codeNode: AbstractCodeNode) => codeNode.type === nodeType);
  }

  getNodesBySameType(type: string): AbstractCodeNode[] {
    return this.codeNodes.filter((codeNode: AbstractCodeNode) => codeNode.type === type) as AbstractCodeNode[];
  }

  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.codeNodes.filter(
      (codeNode: AbstractCodeNode) => codeNode.variableName === variableName,
    ) as AbstractCodeNode[];
  }

  /**
   * Check whether the graph has this connection.
   * @param from node interface
   * @param to node interface
   * @returns boolean
   */
  hasConnection(from: NodeInterface, to: NodeInterface): boolean {
    return this.connections.some(
      (connection: Connection) => connection.from.id === from.id && connection.to.id === to.id,
    );
  }

  /**
   * Triggers on code graph update.
   */
  onUpdate() {
    if (this.uuid !== this.graph.id) return;

    if (this.nodes.length > 0 && this.connections.length > 0) this.sortNodes();
  }

  /**
   * Remove connection from the graph
   * @param connection connection between code nodes
   */
  removeConnection(connection: Connection): void {
    this.graph.removeConnection(connection);
  }

  /**
   * Remove node from the graph.
   * @param codeNode code node
   */
  removeNode(codeNode: AbstractCodeNode): void {
    this.graph.removeNode(codeNode as AbstractNode);
  }

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IEditorState {
    this.sortNodes();

    const editorState = this.viewModel.editor.save();
    editorState.graph.id = this.uuid;

    this.saveNodeStates(editorState.graph.nodes);

    return JSON.parse(JSON.stringify(editorState));
  }

  /**
   * Save node states.
   * @param nodeStates a list of node state.
   */
  saveNodeStates(nodeStates: INodeState<unknown, unknown>[]): void {
    nodeStates.forEach((nodeState: INodeState<unknown, unknown>, nodeIdx) => {
      const node = this.nodes[nodeIdx] as AbstractCodeNode;
      nodeState.integrated = node.state.integrated;
      nodeState.props = node.state.props;

      Object.entries(nodeState.inputs).forEach(([inputKey]) => {
        if (node.inputs[inputKey]) nodeState.inputs[inputKey].hidden = node.inputs[inputKey].hidden;
      });

      Object.entries(nodeState.outputs).forEach(([outputKey]) => {
        if (node.inputs[outputKey]) nodeState.outputs[outputKey].hidden = node.outputs[outputKey].hidden;
      });
    });
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return;

    this.unsubscribe();
    try {
      // Get a list of edges
      const edges: [string, string | undefined][] = this.connections.map((connection: Connection) => [
        connection.to.nodeId,
        connection.from.nodeId,
      ]);

      // Get a list of node
      let nodeIds = [...this.nodeIds];

      nodeIds.reverse();

      // Get sorted node ids
      nodeIds = toposort.array(nodeIds, edges);

      nodeIds.reverse();

      // Update sorted nodes
      this.nodes = nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
    } catch {
      console.warn("Failed to sort nodes.");
    }
    this.subscribe();
  }

  /**
   * Subscribe on update.
   */
  subscribe(): void {}

  /**
   * Unsubscribe on update.
   */
  unsubscribe(): void {}
}

/**
 * Get nodes of current graph.
 * @param graph graph / subgraph
 * @returns list of code nodes
 */
export const getCodeNodes = (graph: CodeGraph | Graph): AbstractCodeNode[] => {
  let nodes: AbstractCodeNode[] = [];

  graph.nodes.forEach((node: AbstractCodeNode) => {
    if (node.subgraph) {
      nodes = nodes.concat(getCodeNodes(node.subgraph));
    } else {
      nodes.push(node);
    }
  });

  return nodes;
};

/**
 * Get position at specific column.
 * @param col column
 * @param offset number
 * @returns position
 */
export const getPositionAtColumn = (col: number = 0, offset: number = 100): IPosition => {
  const left = 300;
  const width = 350;
  const space = 70;

  return {
    x: left + col * (width + space),
    y: offset,
  };
};

/**
 * Get position before target node.
 * @param node code node
 * @returns position
 */
export const getPositionBeforeNode = (targetNode: AbstractCodeNode): IPosition => {
  const position = { ...targetNode.position };

  position.x -= 400;
  position.y += 50;

  return position;
};
