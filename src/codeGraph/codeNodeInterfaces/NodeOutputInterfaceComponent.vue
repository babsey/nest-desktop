<template>
  <div>{{ intf.name || intf.node?.label }}</div>
</template>

<script setup lang="ts">
import type { NodeOutputInterface } from "./nodeOutputInterface";

defineProps<{ intf: NodeOutputInterface }>();
</script>
