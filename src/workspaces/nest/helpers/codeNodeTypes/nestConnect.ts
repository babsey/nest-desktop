// nestConnect.ts

import {
  displayInSidebar,
  NodeInterface,
  NumberInterface,
  SelectInterface,
  setType,
  TextInputInterface,
} from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import {
  INESTNodeCollection,
  // INESTSynapseCollection,
  nestNodeCollectionType,
  // nestSynapseCollectionType,
} from "./interfaceTypes";

export default defineDynamicCodeNode({
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
    model: () => new TextInputInterface("model", "static_synapse").use(displayInSidebar, true).setHidden(true),
    weight: () => new NumberInterface("syn_spec", 1).use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const preNodes = this.node.getConnectedNodesByInterface("pre");
    const postNodes = this.node.getConnectedNodesByInterface("post");
    if (preNodes.length === 0 || postNodes.length === 0) return this.type;
    const args = [
      this.code?.graph.formatLabels(preNodes).join("+"),
      this.code?.graph.formatLabels(postNodes).join("+"),
    ];

    const synSpecs = [];
    if (this.node.inputs.model.value !== "static_synapse")
      synSpecs.push(`"synapse_model": "${this.node.inputs.model.value}"`);
    if (this.node.inputs.weight.value !== 1) synSpecs.push(`"weight": ${this.node.inputs.weight.value}`);
    if (synSpecs.length > 0) args.push(`syn_spec={\n\t${synSpecs.join(",\n\t")}\n}`);

    return `nest.Connect(${args.join(", ")})`;
  },
  onCreate() {
    this.state.role = "network";
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.connections.all[this.indexOfNodeType];
    if (!this.networkItem) return;
    this.networkItem.codeNode = this;
  },
  onUpdate({ conn_spec }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (conn_spec === "pairwise_bernoulli")
      inputs["p"] = () => new NumberInterface("p", 0.1, 0.01, 1).use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
});
