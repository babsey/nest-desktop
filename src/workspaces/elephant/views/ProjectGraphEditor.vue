<template>
  <v-layout full-height>
    <CodeGraphEditor v-if="codeGraphStore" :view-model="codeGraphStore.viewModel" />
  </v-layout>
</template>

<script setup lang="ts">
import CodeGraphEditor from "@/codeGraph/components/CodeGraphEditor.vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
</script>
