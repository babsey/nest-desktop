<template>
  <div>{{ node.label }}</div>
</template>

<script setup lang="ts">
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";

defineProps<{ node: AbstractCodeNode }>();
</script>
