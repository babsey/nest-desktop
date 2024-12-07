<template>
  <v-card title="Select a module">
    <v-card-text>
      <NESTModuleSelect
        @update:model-value="fetchInstalledModels()"
        return-object
        v-model="state.selectedModule"
      />

      <v-list>
        <v-list-subheader text="Models" />

        <v-list-item
          :key="index"
          :to="{
            name: 'nestModel',
            params: { modelId },
          }"
          @click="closeDialog()"
          v-for="(modelId, index) in state.selectedModule.models"
        >
          {{ modelId }}

          <template #append>
            <v-icon
              color="green"
              icon="mdi:mdi-check"
              v-if="moduleStore.state.installedModels.includes(modelId)"
            />
            <v-icon color="red" icon="mdi:mdi-cancel" v-else />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-btn
        append-icon="mdi:mdi-open-in-new"
        href="https://nestml.readthedocs.io"
        target="_blank"
        text="help"
        title="Doc about NESTML"
      />

      <v-spacer />
      <v-btn
        :disabled="
          appStore.currentSimulator.backends.nestml.state.response.status != 200
        "
        @click="closeDialog(state.selectedModule)"
        text="Generate module"
      />
      <v-btn @click="closeDialog()" text="close" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { nextTick, reactive } from "vue";

import NESTModuleSelect from "../module/NESTModuleSelect.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

const state = reactive<{ selectedModule: IModule }>({
  selectedModule: moduleStore.findModule("nestmlmodule"),
});

const emit = defineEmits(["closeDialog"]);
const closeDialog = (module?: IModule | null) =>
  emit("closeDialog", module ? module : false);

const fetchInstalledModels = () => {
  nextTick(() => {
    moduleStore.fetchInstalledModels(state.selectedModule.name);
  });
};
</script>
