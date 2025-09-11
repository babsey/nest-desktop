<template>
  <v-toolbar class="px-2" color="transparent" density="compact">
    <v-btn-group variant="text">
      <v-btn icon="mdi:mdi-refresh" size="small" @click="() => code.graph.onUpdate()" />
      <v-btn icon="mdi:mdi-sort" size="small" @click="() => (state.showTree = !state.showTree)" />
    </v-btn-group>
    <div style="height: 100%; display: flex; justify-content: flex-end">
      <v-checkbox
        v-model="codeGraphStore.state.autosort"
        density="compact"
        hide-details
        label="autosort"
        @update:model-value="() => code.graph.onUpdate()"
      />
    </div>
    <v-spacer />
    <v-btn-group variant="text">
      <v-btn icon="mdi:mdi-download" size="small" />
      <v-btn icon="mdi:mdi-dots-vertical" size="small" />
    </v-btn-group>
  </v-toolbar>

  <CodeNodeList v-if="state.showTree" :nodes="code.graph.nodes" @change="onChange" />
  <CodeMirror v-if="code" :disabled="state.disabled" :code="code" />
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import { TCode } from "@/types";

import CodeNodeList from "../codeGraph/CodeNodeList.vue";
import CodeMirror from "./CodeMirror.vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
const codeGraphStore = useCodeGraphStore();

const props = defineProps<{ code: TCode }>();
const code = computed(() => props.code);

const state = reactive<{
  disabled: boolean;
  showTree: boolean;
}>({
  disabled: false,
  showTree: false,
});

const onChange = (nodes: AbstractCodeNode[]) => {
  codeGraphStore.state.autosort = false;
  code.value.graph.nodes = nodes;
  code.value.generate();
};
</script>
