<template>
  <div class="baklava-node-palette pa-0">
    <v-expansion-panels elevation="0" density="compact" multiple rounded="0" variant="accordion">
      <v-expansion-panel v-for="c in categories" :key="c.name">
        <v-expansion-panel-title :node-category="c.name" class="baklava-category" style="min-height: 48px !important">
          {{ c.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" style="background-color: transparent">
            <v-list-item v-for="(ni, nt) in c.nodeTypes" :key="nt" style="padding: 1px 2px" @click="() => {}">
              <PaletteEntry :title="ni.title" :type="nt" class="pa-0 ma-0" @pointerdown="onDragStart(nt, ni)" />
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <transition name="fade">
    <div v-if="draggedNode" class="baklava-dragged-node" :style="draggedNodeStyles">
      <PaletteEntry :type="draggedNode.type" :title="draggedNode.nodeInformation.title" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { AbstractNode, INodeTypeInformation } from "@baklavajs/core";
import { computed, CSSProperties, inject, Ref, ref, reactive } from "vue";
import { usePointer } from "@vueuse/core";
import { useViewModel, useTransform, useNodeCategories } from "@baklavajs/renderer-vue";

import PaletteEntry from "./PaletteEntry.vue";
// import { useViewModel, useTransform, useNodeCategories } from "../utility";

interface IDraggedNode {
  type: string;
  nodeInformation: INodeTypeInformation;
}

const { viewModel } = useViewModel();
const { x: mouseX, y: mouseY } = usePointer();
const { transform } = useTransform();
const categories = useNodeCategories(viewModel);

const editorEl = inject<Ref<HTMLElement | null>>("editorEl");

const draggedNode = ref<IDraggedNode | null>(null);

const draggedNodeStyles = computed<CSSProperties>(() => {
  if (!draggedNode.value || !editorEl?.value) {
    return {};
  }
  const { left, top } = editorEl.value.getBoundingClientRect();
  return {
    top: `${mouseY.value - top}px`,
    left: `${mouseX.value - left}px`,
  };
});

const onDragStart = (type: string, nodeInformation: INodeTypeInformation) => {
  draggedNode.value = {
    type,
    nodeInformation,
  };

  const onDragEnd = () => {
    const instance = reactive(new nodeInformation.type()) as AbstractNode;
    viewModel.value.displayedGraph.addNode(instance);

    const rect = editorEl!.value!.getBoundingClientRect();
    const [x, y] = transform(mouseX.value - rect.left, mouseY.value - rect.top);
    instance.position.x = x;
    instance.position.y = y;

    draggedNode.value = null;
    document.removeEventListener("pointerup", onDragEnd);
  };
  document.addEventListener("pointerup", onDragEnd);
};
</script>

<style lang="scss">
.baklava-node-palette {
  .v-expansion-panel {
    background-color: transparent;
    color: rgba(var(--v-theme-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
