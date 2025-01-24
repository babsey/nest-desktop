<template>
  <BaklavaEditor :view-model="viewModel">
    <template #palette>
      <NodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node)" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BaklavaEditor, useBaklava } from "@baklavajs/renderer-vue";

import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import NodePalette from "./NodePalette.vue";
import CodeGraphNode from "./CodeGraphNode.vue";

const props = defineProps<{ graph: CodeGraph }>();
const graph = computed(() => props.graph);

const codeGraphStore = useCodeGraphStore();
const viewModel = useBaklava(codeGraphStore.viewModel.editor);

const onUpdate = (node: CodeNode) => node.events.update.emit(node);
</script>
