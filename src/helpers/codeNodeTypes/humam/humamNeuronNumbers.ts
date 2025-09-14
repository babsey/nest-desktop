// humamNeuronNumbers.ts

import { CheckboxInterface, displayInSidebar, NumberInterface, TextInputInterface } from "baklavajs";

import { NodeOutputInterface, defineCodeNode } from "@/codeGraph";
import { parseBoolean } from "@/utils/boolean";

export default defineCodeNode({
  type: "humam.NeuronNumbers",
  title: "neuron numbers",
  variableName: "nn",
  inputs: {
    surface_area: () => new NumberInterface("surface area", 1),
    source: () => new TextInputInterface("source", ""),
    src_path: () => new TextInputInterface("src path", ""),
    ei_ratio_path: () => new TextInputInterface("ei ratio path", ""),
    min_neurons_per_layer: () => new NumberInterface("mun neurons per layer", 1),
    remove_smaller_layerI: () => new CheckboxInterface("remove smaller layer I", false),
    target: () => new TextInputInterface("target", "").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const surfaceArea = this.node.getConnectedNodeByInterface("surface_area");
    if (surfaceArea != undefined) args.push(`${surfaceArea.value}`);
    else args.push(`${this.node.inputs.surface_area.value}`);

    const source = this.node.getConnectedNodeByInterface("source");
    if (source != undefined) args.push(`${source.value}`);
    else args.push(`"${this.node.inputs.source.value}"`);

    const srcPath = this.node.getConnectedNodeByInterface("src_path");
    if (srcPath != undefined) args.push(`${srcPath.value}`);
    else args.push(`"${this.node.inputs.src_path.value}"`);

    const EIRatioPath = this.node.getConnectedNodeByInterface("ei_ratio_path");
    if (EIRatioPath != undefined) args.push(`${EIRatioPath.value}`);
    else args.push(`"${this.node.inputs.ei_ratio_path.value}"`);

    const minNeuronsPerLayer = this.node.getConnectedNodeByInterface("min_neurons_per_layer");
    if (minNeuronsPerLayer != undefined) args.push(`${minNeuronsPerLayer.value}`);
    else args.push(`${this.node.inputs.min_neurons_per_layer.value}`);

    const removeSmallerLayerI = this.node.getConnectedNodeByInterface("remove_smaller_layerI");
    if (removeSmallerLayerI != undefined) args.push(`${removeSmallerLayerI.value}`);
    else args.push(`${parseBoolean(this.node.inputs.remove_smaller_layerI.value)}`);

    return `humam.NeuronNumbers(${args.join(", ")})`;
  },
});
