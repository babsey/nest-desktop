<template>
  <v-card :title="model.state.label" subtitle="model editor">
    <v-card-text>
      <h3>Code template</h3>
      <codemirror
        ref="codeMirror"
        style="font-size: 0.75rem; width: 100%"
        v-model="model.codeTemplate"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn @click="modelStore.save()" text="save" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";

import { PyNNModel } from "../helpers/model/model";
import { TModelStore } from "@/stores/model/defineModelStore";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = usePyNNModelStore();

const model = computed(() => modelStore.model as PyNNModel);
</script>
