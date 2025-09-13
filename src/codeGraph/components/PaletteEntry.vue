<template>
  <div class="baklava-node --palette" :data-node-type="type">
    <div class="__title">
      <div class="__title-label">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GRAPH_NODE_TYPE_PREFIX } from "@baklavajs/core";
// import { IMenuItem } from "@baklavajs/renderer-vue/dist/contextmenu";
import { computed, defineComponent, ref } from "vue";
import { useGraph, useViewModel } from "@baklavajs/renderer-vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { viewModel } = useViewModel();
    const { switchGraph } = useGraph();

    const showContextMenu = ref(false);
    const hasContextMenu = computed(() => props.type.startsWith(GRAPH_NODE_TYPE_PREFIX));

    const contextMenuItems = [
      { label: "Edit Subgraph", value: "editSubgraph" },
      { label: "Delete Subgraph", value: "deleteSubgraph" },
    ];

    const openContextMenu = () => {
      showContextMenu.value = true;
    };

    const onContextMenuClick = (action: string) => {
      const graphTemplateId = props.type.substring(GRAPH_NODE_TYPE_PREFIX.length);
      const graphTemplate = viewModel.value.editor.graphTemplates.find((gt) => gt.id === graphTemplateId);
      if (!graphTemplate) {
        return;
      }

      switch (action) {
        case "editSubgraph":
          switchGraph(graphTemplate);
          break;
        case "deleteSubgraph":
          viewModel.value.editor.removeGraphTemplate(graphTemplate);
          break;
      }
    };

    return { showContextMenu, hasContextMenu, contextMenuItems, openContextMenu, onContextMenuClick };
  },
});
</script>
