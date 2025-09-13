<template>
  <v-layout id="networkGraphLayout" class="networkGraphLayout" full-height>
    <template v-if="projectViewStore.state.views.graph === 'network'">
      <NetworkEditorToolbar />

      <NetworkGraph :key="currentProject.id" :network="currentProject.network" />
    </template>

    <CodeGraphEditor
      v-if="codeGraphStore && projectViewStore.state.views.graph === 'code'"
      :view-model="codeGraphStore.viewModel"
    />
  </v-layout>
</template>

<script setup lang="ts">
import CodeGraphEditor from "@/codeGraph/components/CodeGraphEditor.vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";

import { currentProject } from "../stores/project/projectStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace.views.project;

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
</script>
