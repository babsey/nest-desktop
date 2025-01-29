<template>
  <BaklavaEditor :view-model="viewModel">
    <template #palette>
      <NodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { Editor } from "baklavajs";
import { BaklavaEditor, useBaklava } from "@baklavajs/renderer-vue";

import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import NodePalette from "./NodePalette.vue";
import CodeGraphNode from "./CodeGraphNode.vue";

defineProps<{ graph: CodeGraph }>();

const codeGraphStore = useCodeGraphStore();
const viewModel = useBaklava(codeGraphStore.viewModel.editor as Editor);

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null);
</script>
