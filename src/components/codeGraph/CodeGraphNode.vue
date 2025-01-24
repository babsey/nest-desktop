<template>
  <div
    :id="node.id"
    ref="el"
    class="baklava-node"
    :class="classes"
    :style="styles"
    :data-node-type="node.type"
    @pointerdown="select"
  >
    <div v-if="viewModel.settings.nodes.resizable" class="__resize-handle" @mousedown="startResize" />

    <div :title="node.type" class="__title" @pointerdown.self.stop="startDrag" @contextmenu.prevent="openContextMenu">
      <template v-if="!renaming">
        <div class="__title-label">{{ node.idx + 1 }} - {{ node.title }}</div>
        <div class="__menu">
          <v-icon
            :icon="node.hidden ? 'mdi:mdi-eye-off-outline' : 'mdi:mdi-eye'"
            class="mx-1 --clickable"
            size="xsmall"
            @click="toggleHidden"
          />
          <v-icon icon="mdi:mdi-pencil" class="mx-1 --clickable" size="xsmall" @click="openSidebar" />
          <v-icon icon="mdi:mdi-dots-vertical" class="--clickable" size="xsmall" @click="openContextMenu" />
          <context-menu v-model="showContextMenu" :x="0" :y="0" :items="contextMenuItems" @click="onContextMenuClick" />
        </div>
      </template>
      <input
        v-else
        ref="renameInputEl"
        v-model="tempName"
        type="text"
        class="baklava-input"
        placeholder="Node Name"
        @blur="doneRenaming"
        @keydown.enter="doneRenaming"
      />
    </div>

    <div class="__content" :class="classesContent" @keydown.delete.stop>
      <!-- Outputs -->
      <div class="__outputs">
        <template v-for="output in displayedOutputs" :key="output.id">
          <slot name="nodeInterface" type="output" :node="node" :intf="output">
            <NodeInterface :node="node" :intf="output" />
          </slot>
        </template>
      </div>

      <!-- Inputs -->
      <div class="__inputs">
        <template v-for="input in displayedInputs" :key="input.id">
          <slot name="nodeInterface" type="input" :node="node" :intf="input">
            <NodeInterface :node="node" :intf="input" />
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUpdated, onMounted, onBeforeUnmount } from "vue";
import { AbstractNode, GRAPH_NODE_TYPE_PREFIX, IGraphNode } from "@baklavajs/core";
import { Components, useGraph, useViewModel } from "@baklavajs/renderer-vue";

const ContextMenu = Components.ContextMenu;
const NodeInterface = Components.NodeInterface;

// import VerticalDots from "../icons/VerticalDots.vue";
const props = withDefaults(
  defineProps<{
    node: AbstractNode;
    selected?: boolean;
    dragging?: boolean;
  }>(),
  { selected: false },
);

const node = computed(() => props.node);

const emit = defineEmits<{
  (e: "select"): void;
  (e: "start-drag", ev: PointerEvent): void;
  (e: "update"): void;
}>();

const { viewModel } = useViewModel();
const { graph, switchGraph } = useGraph();

const el = ref<HTMLElement | null>(null);
const renaming = ref(false);
const tempName = ref("");
const renameInputEl = ref<HTMLInputElement | null>(null);
const isResizing = ref(false);
let resizeStartWidth = 0;
let resizeStartMouseX = 0;

const showContextMenu = ref(false);
const contextMenuItems = computed(() => {
  const items = [
    { value: "rename", label: "Rename" },
    { value: "delete", label: "Delete" },
  ];

  if (props.node.type.startsWith(GRAPH_NODE_TYPE_PREFIX)) {
    items.push({ value: "editSubgraph", label: "Edit Subgraph" });
  }

  return items;
});

const classes = computed(() => ({
  "--selected": props.selected,
  "--dragging": props.dragging,
  "--two-column": !!props.node.twoColumn,
  "--hidden": props.node.hidden,
}));

const classesContent = computed(() => ({
  "--reverse-y": props.node.reverseY ?? viewModel.value.settings.nodes.reverseY,
}));

const styles = computed(() => ({
  top: `${props.node.position?.y ?? 0}px`,
  left: `${props.node.position?.x ?? 0}px`,
  "--width": `${props.node.width ?? viewModel.value.settings.nodes.defaultWidth}px`,
}));

const displayedInputs = computed(() => Object.values(props.node.inputs).filter((ni) => !ni.hidden));
const displayedOutputs = computed(() => Object.values(props.node.outputs).filter((ni) => !ni.hidden));

const select = () => {
  emit("select");
};

const startDrag = (ev: PointerEvent) => {
  if (!props.selected) {
    select();
  }

  emit("start-drag", ev);
};

const openContextMenu = () => {
  showContextMenu.value = true;
};

const openSidebar = () => {
  const sidebar = viewModel.value.displayedGraph.sidebar;
  sidebar.nodeId = props.node.id;
  // sidebar.optionName = props.intf.name;
  sidebar.visible = true;
};

const onContextMenuClick = async (action: string) => {
  switch (action) {
    case "delete":
      graph.value.removeNode(props.node);
      break;
    case "rename":
      tempName.value = props.node.title;
      renaming.value = true;
      await nextTick();
      renameInputEl.value?.focus();
      break;
    case "editSubgraph":
      switchGraph((props.node as AbstractNode & IGraphNode).template);
      break;
  }
};

const doneRenaming = () => {
  props.node.title = tempName.value;
  renaming.value = false;
};

const onRender = () => {
  if (el.value) {
    viewModel.value.hooks.renderNode.execute({ node: props.node, el: el.value });
  }
};

const startResize = (ev: MouseEvent) => {
  isResizing.value = true;
  resizeStartWidth = props.node.width;
  resizeStartMouseX = ev.clientX;
  ev.preventDefault();
};

const toggleHidden = (ev: MouseEvent) => {
  node.value.hidden = !node.value.hidden;
  emit("update");
};

const doResize = (ev: MouseEvent) => {
  if (!isResizing.value) return;
  const deltaX = ev.clientX - resizeStartMouseX;
  const newWidth = resizeStartWidth + deltaX / graph.value.scaling;
  const minWidth = viewModel.value.settings.nodes.minWidth;
  const maxWidth = viewModel.value.settings.nodes.maxWidth;
  props.node.width = Math.max(minWidth, Math.min(maxWidth, newWidth));
};

const stopResize = () => {
  isResizing.value = false;
};

onMounted(() => {
  onRender();

  window.addEventListener("mousemove", doResize);
  window.addEventListener("mouseup", stopResize);
});
onUpdated(onRender);

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", doResize);
  window.removeEventListener("mouseup", stopResize);
});
</script>
