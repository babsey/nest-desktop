<template>
  <v-list :class="{ active: drag }" class="code-nodes" density="compact">
    <draggable
      v-model="nodes"
      v-bind="dragOptions"
      handle=".handle"
      item-key="id"
      @end="onDragEnd"
      @start="onDragStart"
    >
      <template #item="{ element }">
        <v-list-item :disabled="element.state?.integrated" class="code-node">
          <v-btn class="drag-icon handle" icon="mdi:mdi-drag" size="xsmall" variant="text" />
          <span :class="{ hidden: element.idx === -1 }" class="idx"> {{ element.idx + 1 }} - </span>
          {{ element.title }}
        </v-list-item>
      </template>
    </draggable>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";

import type { AbstractCodeNode } from "./codeNode";

const props = defineProps<{ nodes: AbstractCodeNode[] }>();
const emit = defineEmits(["change"]);

const drag = ref(false);
const nodes = ref(props.nodes);

const dragOptions = {
  animation: 200,
  // disabled: false,
  ghostClass: "ghost",
};

const onDragStart = () => {
  drag.value = true;
};

const onDragEnd = () => {
  drag.value = false;
  emit("change", nodes.value);
};
</script>

<style lang="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.code-nodes {
  font-size: 12px;
  font-family: monospace;

  .code-node {
    background-color: var(--v-theme-on-surface);
    // cursor: pointer;
    height: 1.5em;
    min-height: auto;
    // line-height: 20px;

    .drag-icon {
      opacity: 0;
    }

    .idx {
      display: inline-block;
      text-align: right;
      width: 32px;
    }

    .hidden {
      opacity: 0;
    }

    &:hover {
      // background: #c8ebfb;

      .drag-icon {
        opacity: 1;
      }
    }
  }

  &.active {
    .code-node {
      opacity: var(--v-high-emphasis-opacity);
    }
  }
}
</style>
