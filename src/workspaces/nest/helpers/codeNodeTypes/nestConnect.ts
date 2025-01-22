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
  onUpdate({ conn_spec }) {
    if (conn_spec === "pairwise_bernoulli") {
      return {
        inputs: {
          p: () => new NumberInterface("p", 0.1, 0.01, 1).use(displayInSidebar, true).setHidden(true),
        },
      };
    }
    return {};
  },
  codeTemplate: (node) => {
    if (!node) return "";
    const preNode = node.getSourceNode("pre");
    const postNode = node.getSourceNode("post");
    if (!preNode || !postNode) return "";
    return `nest.Connect(${preNode.label}, ${postNode.label})`;
  },
});
