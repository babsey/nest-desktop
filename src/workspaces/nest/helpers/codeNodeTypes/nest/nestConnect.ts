// nestConnect.ts

import { displayInSidebar, SelectInterface, setType, TextInputInterface } from "baklavajs";
import { AbstractCodeNode, NodeInputInterface, defineCodeNode, formatLabels, getPositionAtColumn } from "@/codeGraph";

import { CodeGraph } from "@/helpers/code/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";

import nestConnect from "./nestConnect";
import { INESTConnectionProps, NESTConnection } from "../../connection/connection";
import {
  INESTNodeCollection,
  // INESTSynapseCollection,
  nestNodeCollectionType,
  // nestSynapseCollectionType,
} from "./interfaceTypes";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { getNESTSimulateNode } from "./nestSimulate";
import { cleanNESTParameterNode, updateNESTParameterNode } from "./nestParameters";

export default defineCodeNode({
  type: "nest.Connect",
  title: "connect nodes",
  inputs: {
    pre: () => new NodeInputInterface<INESTNodeCollection>("pre").use(setType, nestNodeCollectionType),
    post: () => new NodeInputInterface<INESTNodeCollection>("post").use(setType, nestNodeCollectionType),
    conn_spec: () =>
      new SelectInterface("conn_spec", "all_to_all", [
        "all_to_all",
        "one_to_one",
        "fixed_indegree",
        "fixed_outdegree",
        "pairwise_bernoulli",
      ])
        .use(displayInSidebar, true)
        .setHidden(true),
    syn_spec: () => new TextInputInterface("syn_spec", "static_synapse").use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const pre = this.node.getConnectedNodesByInterface("pre");
    const post = this.node.getConnectedNodesByInterface("post");
    if (pre.length === 0 || post.length === 0) return this.type;
    const args = [formatLabels(pre).join("+"), formatLabels(post).join("+")];
    let keyword = "";

    const connSpecs = [];
    let connSpec = "";

    if (this.node.inputs.p && !this.node.inputs.p.hidden) connSpecs.push(`"p": ${this.node.inputs.p.value}`);
    if (this.node.inputs.indegree && !this.node.inputs.indegree.hidden)
      connSpecs.push(`"indegree": ${this.node.inputs.indegree.value}`);
    if (this.node.inputs.outdegree && !this.node.inputs.outdegree.hidden)
      connSpecs.push(`"outdegree": ${this.node.inputs.outdegree.value}`);

    if (this.node.inputs.conn_spec && !this.node.inputs.conn_spec.hidden)
      if (connSpecs.length === 0) connSpec = `"${this.node.inputs.conn_spec.value}"`;
      else connSpecs.unshift(`"rule": "${this.node.inputs.conn_spec.value}"`);

    if (connSpec.length === 0 && connSpecs.length > 0) connSpec = `{\n\t${connSpecs.join(",\n\t")}\n}`;
    if (connSpec.length > 0) args.push(`${connSpec}`);

    let synSpec = "";
    if (!this.node.inputs.syn_spec.hidden) {
      const synSpecNode = this.node.getConnectedNodeByInterface("syn_spec");
      if (synSpecNode != undefined) synSpec = `${synSpecNode.value}`;
      else synSpec = `"${this.node.inputs.syn_spec.value}"`;
    }
    if (args.length === 2) keyword = "syn_spec=";
    if (synSpec.length > 0) args.push(`${keyword}${synSpec}`);

    return `nest.Connect(${args.join(", ")})`;
  },
  onGraphUpdate() {
    if (!this.node) return;

    let nestConnection = this.node.view as NESTConnection;
    if (!nestConnection) {
      const connectionProps: Record<string, unknown> = {};

      const sourceNode = this.node.getConnectedNodeByInterface("pre");
      if (sourceNode) connectionProps.source = sourceNode.view.idx;

      const targetNode = this.node.getConnectedNodeByInterface("post");
      if (targetNode) connectionProps.target = targetNode.view.idx;

      const connSpecNode = this.node.getConnectedNodeByInterface("conn_spec");
      if (connSpecNode) {
        const paramProps = Object.entries(connSpecNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
        if (paramProps.length > 0) connectionProps.params = paramProps;
      }

      const synSpecNode = this.node.getConnectedNodeByInterface("syn_spec");
      if (synSpecNode) {
        const paramProps = Object.entries(synSpecNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
        if (paramProps.length > 0) connectionProps.synapse = { params: paramProps };
      }

      nestConnection = new NESTConnection(this.node.code.project.network.connections, connectionProps);

      this.node.view = nestConnection;
      nestConnection.codeNodes.node = this.node;

      nestConnection.init();
    }

    const connSpecNode = this.node.getConnectedNodeByInterface("conn_spec");
    if (connSpecNode) {
      // cleanNESTParameterNode(connSpecNode, this.node.view);
    } else {
      this.node.inputs.conn_spec.setHidden(true);
    }

    const synSpecNode = this.node.getConnectedNodeByInterface("syn_spec");
    if (synSpecNode) {
      synSpecNode.view = nestConnection.synapse;
      cleanNESTParameterNode(synSpecNode, nestConnection);
    } else {
      this.node.inputs.syn_spec.setHidden(true);
    }

    // if (!this.node.view && !this.node.view.model && !this.node.view.model.isRecorder) return;
    // updateRecorderNode(this.node.graph, this.node.view.recorder.codeNode);
  },
});

export const addNESTConnectNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Connect").length;
  const codeNode = graph.addNodeAtCoordinates(nestConnect, getPositionAtColumn(3, 100 + 200 * idx));
  if (idx === 0) codeNode.state.comments = "Connect nodes";
  return codeNode;
};

export const loadNESTConnectNode = (
  graph: CodeGraph | NESTCodeGraph,
  connectionProps?: INESTConnectionProps,
  nodes: AbstractCodeNode[] = [],
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = addNESTConnectNode(graph, idx);
  if (connectionProps) codeNode.state.props = connectionProps;

  if (connectionProps.params) {
    const conn_spec: IParamProps[] = [];

    const connParams = connectionProps.params.filter((param: IParamProps) =>
      "visible" in param ? param.visible : true,
    );
    if (connParams && connParams.length > 0) connParams.forEach((param: IParamProps) => conn_spec.push(param));
    if (conn_spec.length > 0) updateNESTParameterNode(graph, codeNode, "conn_spec", conn_spec);
  }

  if (connectionProps.synapse) {
    const syn_spec: IParamProps[] = [];

    if (connectionProps.synapse.model && connectionProps.synapse.model !== "static_synapse") {
      syn_spec.push({
        id: "synapse_model",
        value: connectionProps.synapse.model,
      });
    }

    // params
    const synParams = connectionProps.synapse.params?.filter((param: IParamProps) =>
      "visible" in param ? param.visible : true,
    );

    if (synParams && synParams.length > 0) synParams.forEach((param: IParamProps) => syn_spec.push(param));
    if (syn_spec.length > 0) updateNESTParameterNode(graph, codeNode, "syn_spec", syn_spec);
  }

  if (nodes) {
    graph.addConnection(codeNode.inputs.pre, nodes[connectionProps.source].outputs.out);
    graph.addConnection(nodes[connectionProps.target].outputs.out, codeNode.inputs.post);
  }

  const simulateNode = getNESTSimulateNode(graph);

  if (!graph.hasConnection(codeNode.outputs._node, simulateNode.inputs._node))
    graph.addConnection(codeNode.outputs._node, simulateNode.inputs._node);

  return codeNode;
};
