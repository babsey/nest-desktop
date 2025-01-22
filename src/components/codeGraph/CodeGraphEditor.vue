<template>
  <!--
      By default, the editor completely fills its parent HTML element.
      If you directly use the editor in the <body> element, make sure to use
      a wrapper <div> with specified width and height properties:
      <div style="width: 90vw; height: 90vh">
          <BaklavaEditor :view-model="baklava" />
      </div>
  -->
  <BaklavaEditor :view-model>
    <template #palette>
      <NodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { BaklavaEditor, IBaklavaViewModel } from "@baklavajs/renderer-vue";

import NodePalette from "./NodePalette.vue";
import CodeGraphNode from "./CodeGraphNode.vue";

defineProps<{ viewModel: IBaklavaViewModel }>();
</script>
