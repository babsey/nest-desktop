<template>
  <BaklavaEditor :view-model>
    <!-- <template #toolbar>
      <CodeGraphToolbar :view-model />
    </template> -->

    <template #palette>
      <CodeNodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>

    <template #sidebar="nodeProps">
      <CodeGraphSidebar v-bind="nodeProps" />
    </template>

    <!-- <template #contextMenu="contextMenu">
      <ContextMenu
        v-if="viewModel.settings.contextMenu.enabled"
        v-model="contextMenu.show.value"
        :items="contextMenu.items.value"
        :x="contextMenu.x.value"
        :y="contextMenu.y.value"
        @click="contextMenu.onClick"
      />
    </template> -->
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { BaklavaEditor, IBaklavaViewModel } from "@baklavajs/renderer-vue";
// import { toRef } from "vue";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
// import { provideTemporaryConnection } from "@/helpers/codeGraph/temporaryConnection";
// import { useContextMenu } from "@/helpers/codeGraph/contextMenu";

import CodeGraphNode from "./CodeGraphNode.vue";
import CodeGraphSidebar from "./CodeGraphSidebar.vue";
// import CodeGraphToolbar from "./CodeGraphToolbar.vue";
import CodeNodePalette from "./CodeNodePalette.vue";

// const ContextMenu = Components.ContextMenu;

defineProps<{ viewModel: IBaklavaViewModel }>();

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null);

// const temporaryConnection = provideTemporaryConnection();
</script>
