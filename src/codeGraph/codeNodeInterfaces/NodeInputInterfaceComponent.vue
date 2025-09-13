<template>
  <div>{{ intf.name || intf.id }}</div>
</template>

<script setup lang="ts">
import type { NodeInputInterface } from "./nodeInputInterface";

defineProps<{ intf: NodeInputInterface }>();
</script>
