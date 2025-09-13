<template>
  <BaklavaEditor :view-model>
    <template #palette>
      <CodeNodePalette v-if="viewModel.settings.palette.enabled" />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>

    <template #sidebar="nodeProps">
      <CodeGraphSidebar v-bind="nodeProps" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { BaklavaEditor } from "@baklavajs/renderer-vue";

import CodeGraphNode from "./CodeGraphNode.vue";
import CodeGraphSidebar from "./CodeGraphSidebar.vue";
import CodeNodePalette from "../codeNode/CodeNodePalette.vue";

import type { AbstractCodeNode } from "../codeNode";
import { ICodeGraphViewModel } from "../viewModel";

defineProps<{ viewModel: ICodeGraphViewModel }>();

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null);
</script>
