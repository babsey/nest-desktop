<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <NetworkEditorToolbar />
    <NetworkGraph :key="network.project.id" :network />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import { BaseNetwork } from "@/helpers/network/network";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = usePyNNProjectStore();

const network = computed(
  () => projectStore.state.project.network as BaseNetwork
);
</script>
