<template>
  <v-layout full-height>
    <CodeGraphEditor :view-model="currentProject.code.graph.viewModel" />
    <!-- <DrawFlow :connections :nodes /> -->
  </v-layout>
</template>

<script lang="ts" setup>
// import DrawFlow, { IDrawflowConnection, IDrawflowNode } from "@/components/drawflow/DrawFlow.vue";
import CodeGraphEditor from "@/components/codeGraph/CodeGraphEditor.vue";

import { currentProject } from "../stores/project/projectStore";

// const nodes: IDrawflowNode[] = [
//   {
//     name: "spiketrains",
//     inputs: 0,
//     outputs: 2,
//     posx: 50,
//     posy: 150,
//     className: "data",
//     html: "Spiketrains",
//   },
//   {
//     name: "scatter",
//     outputs: 0,
//     posx: 250,
//     posy: 100,
//     className: "plot",
//     html: "Scatter",
//   },
//   {
//     name: "ts_hist",
//     posx: 250,
//     posy: 200,
//     className: "analysis",
//     html: "Time histogram",
//   },
//   {
//     name: "bar_chart",
//     outputs: 0,
//     posx: 450,
//     posy: 150,
//     className: "plot",
//     html: "Bar chart",
//   },
//   {
//     name: "ts_hist",
//     posx: 250,
//     posy: 300,
//     className: "analysis",
//     html: "Time histogram",
//   },
//   {
//     name: "heatmap",
//     outputs: 0,
//     posx: 450,
//     posy: 250,
//     className: "plot",
//     html: "Heatmap",
//   },
//   {
//     name: "corrcoef",
//     posx: 450,
//     posy: 350,
//     className: "analysis",
//     html: "Correlation coefficient",
//   },
//   {
//     name: "heatmap",
//     outputs: 0,
//     posx: 650,
//     posy: 300,
//     className: "plot",
//     html/: "Heatmap",
//   },
// ];

// const connections: IDrawflowConnection[] = [
//   { outputNodeId: 1, inputNodeId: 2, outputName: "output_2" },
//   { outputNodeId: 1, inputNodeId: 3 },
//   { outputNodeId: 1, inputNodeId: 5, outputName: "output_2" },
//   { outputNodeId: 3, inputNodeId: 4 },
//   { outputNodeId: 5, inputNodeId: 6 },
//   { outputNodeId: 5, inputNodeId: 7 },
//   { outputNodeId: 7, inputNodeId: 8 },
// ];
</script>
