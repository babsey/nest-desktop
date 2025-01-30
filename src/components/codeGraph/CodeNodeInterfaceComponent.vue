<template>
  <div>{{ props.intf.name }} {{ props.intf.value }}</div>
</template>

<script setup lang="ts">
import { CodeNodeInterface } from "../../helpers/codeGraph/codeNodeInterface";

const props = defineProps<{ intf: CodeNodeInterface }>();
</script>
