<template>
  <v-layout full-height>
    <CodeGraphEditor :view-model="currentProject.code.graph.viewModel" />
  </v-layout>
</template>

<script lang="ts" setup>
import CodeGraphEditor from "@/components/codeGraph/CodeGraphEditor.vue";

import { currentProject } from "../stores/project/projectStore";
</script>
