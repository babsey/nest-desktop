<template>
  <BaklavaEditor :view-model="modelView">
    <template #palette>
      <NodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BaklavaEditor, IBaklavaViewModel, useBaklava } from "@baklavajs/renderer-vue";

import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import NodePalette from "./NodePalette.vue";
import CodeGraphNode from "./CodeGraphNode.vue";

defineProps<{ modelView: IBaklavaViewModel }>();
</script>
