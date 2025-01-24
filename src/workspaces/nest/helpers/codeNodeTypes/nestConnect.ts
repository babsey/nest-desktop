// nestConnect.ts

import {
  displayInSidebar,
  NodeInterface,
  NumberInterface,
  SelectInterface,
  setType,
  TextInputInterface,
} from "baklavajs";

import {
  INESTNodeCollection,
  // INESTSynapseCollection,
  nestNodeCollectionType,
  // nestSynapseCollectionType,
} from "./interfaceTypes";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

export default defineDynamicCodeNode({
  type: "nest.Connect",
  title: "Connect nodes",
  inputs: {
    pre: () => new NodeInterface<INESTNodeCollection>("source", "").use(setType, nestNodeCollectionType),
    post: () => new NodeInterface<INESTNodeCollection>("target", "").use(setType, nestNodeCollectionType),
    conn_spec: () =>
      new SelectInterface("conn_spec", "all_to_all", ["all_to_all", "one_to_one", "pairwise_bernoulli"])
        .use(displayInSidebar, true)
        .setHidden(true)
        .setPort(false),
    syn_spec: () => new TextInputInterface("syn_spec", "static_synapse").use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate: (node) => {
    if (!node) return "";
    const preNodes = node.getConnectedNodesByInterface("pre");
    const postNodes = node.getConnectedNodesByInterface("post");
    if (preNodes.length === 0 || postNodes.length === 0) return "nest.Connect";
    const preLabels = preNodes.map((node) => node.label);
    preLabels.sort();
    const postLabels = postNodes.map((node) => node.label);
    postLabels.sort();
    return `nest.Connect(${preLabels.join("+")}, ${postLabels.join("+")})`;
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.connections.all[this.indexOfNodeType];
  },
  onUpdate({ conn_spec }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (conn_spec === "pairwise_bernoulli")
      inputs["p"] = () => new NumberInterface("p", 0.1, 0.01, 1).use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
});
