<template>
  <div>{{ intf.name }} {{ intf.value }}</div>
</template>

<script setup lang="ts">
import type { CodeNodeInterface } from "./codeNodeInterface";

defineProps<{ intf: CodeNodeInterface }>();
</script>
