// nestCreate.ts

import { IntegerInterface, NodeInterface, TextInputInterface, displayInSidebar, setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "create node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType),
    size: () => new IntegerInterface("size", 1, 1).use(setType, numberType).use(displayInSidebar, true),
    params: () => new NodeInputInterface("params"),
    positions: () => new NodeInputInterface("positions"),
  },
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>().use(setType, nestNodeCollectionType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [`"${this.node.inputs.model.value}"`];
    if (this.node.inputs.size.value > 1) args.push(`${this.node.inputs.size.value}`);

    const params = this.node.getConnectedNodesByInterface("params");
    if (params.length > 0) args.push(`params=${this.code?.graph.formatLabels(params).join(", ")}`);

    const positions = this.node.getConnectedNodesByInterface("positions");
    if (positions.length > 0) args.push(`\n\tpositions=${this.code?.graph.formatLabels(positions).join(", ")}`);

    return `nest.Create(${args.join(", ")})`;
  },
  onCreate() {
    this.twoColumn = true;
    this.state.role = "createNode";
  },
  onPlaced() {
    if (!this.code) return;
    const nodeItems = this.code.project.network.nodes.nodeItems;
    this.networkItem = nodeItems[this.indexOfNodeType];
    if (!this.networkItem) {
      this.networkItem = this.code.project.network.nodes.addNode({ model: this.inputs.model.value });
      this.networkItem.codeNodes.node = this;
      this.networkItem.init();
      this.variableName = this.networkItem.model.isNeuron ? "n" : this.networkItem.model.abbreviation;
      this.code.project.network.changes({ prevenSimulation: true });
    }
  },
  onUpdate({ model }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (model.includes("recorder") || model.includes("meter")) {
      outputs["events"] = () => new NodeOutputInterface("events", ".events");
      outputs["times"] = () => new NodeOutputInterface("times", ".events['times']");
      outputs["senders"] = () => new NodeOutputInterface("senders", ".events['senders']");
    }

    const positions = this.node?.getConnectedNodesByInterface("positions") || [];
    if (positions.length > 0) outputs["positions"] = () => new NodeOutputInterface("positions");

    return { inputs, outputs };
  },
  variableName: "node",
});
