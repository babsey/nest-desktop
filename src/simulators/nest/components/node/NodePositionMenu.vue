<template>
  <v-menu
    :close-on-content-click="false"
    :width="400"
    v-model="state.menuOpen"
    activator="parent"
  >
    <v-card
      :min-width="300"
      v-if="nodeSpatial.positions"
    >
      <v-card-text>
        <v-select
          :items="state.positions"
          @update:model-value="initPositions()"
          density="compact"
          hide-details
          v-model="state.selectedPositions"
        />

        <v-switch
          @update:model-value="
            (value: boolean | null) => nextTick(() => {
              nodeSpatial.updatePositionParams({ numDimensions: value ? 3 : 2 })
              nodeSpatial.changes()
            })
          "
          color="primary"
          false-icon="mdi:mdi-numeric-2"
          hide-details
          label="number of dimensions"
          max="3"
          min="2"
          show-ticks="always"
          step="1"
          true-icon="mdi:mdi-numeric-3"
          v-model="state.numDimensions"
        >
        </v-switch>

        <span v-if="nodeSpatial.positions.name === 'free'">
          <ValueSlider
            :thumb-color="nodeSpatial.node.view.color"
            @update:model-value="nodeSpatial.changes()"
            id="n"
            input-label="n"
            label="population size"
            v-model="nodeSpatial.node.size"
          />
        </span>

        <span v-if="nodeSpatial.positions.name === 'grid'">
          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3">shape</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of nodeSpatial.positions.shape"
            >
              <v-text-field
                :label="
                  (nodeSpatial.positions.numDimensions === 2
                    ? ['rows', 'columns']
                    : ['x', 'y', 'z'])[idx]
                "
                :min="1"
                :model-value="item"
                @update:model-value="
            (value: string) => {
              if (nodeSpatial.positions) {
                const shape: number[] = nodeSpatial.positions.shape;
                shape[idx] = parseInt(value);
                nodeSpatial.updatePositionParams({ shape });
              }
            }
          "
                density="compact"
                hide-details
                type="number"
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3">center</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of nodeSpatial.positions.center"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :model-value="item"
                :step="0.1"
                @update:model-value="
            (value: string) => {
              if (nodeSpatial.positions) {
                const center: number[] = nodeSpatial.positions.center;
                center[idx] = parseFloat(value);
                nodeSpatial.updatePositionParams({ center });
              }
            }
          "
                density="compact"
                hide-details
                type="number"
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3" title="">extent</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of nodeSpatial.positions.extent"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :min="0"
                :model-value="item"
                :step="0.1"
                @update:model-value="
          (value: string) => {
            if (nodeSpatial.positions) {
              const extent: number[] = nodeSpatial.positions.extent;
              extent[idx] = parseFloat(value);
              nodeSpatial.updatePositionParams({ extent });
            }
          }
          "
                density="compact"
                hide-details
                type="number"
              />
            </v-col>
          </v-row>
        </span>

        <v-row class="mt-0">
          <v-col class="py-0">
            <v-checkbox
              class="ma-0"
              color="accent"
              label="Edge wrap"
              hide-details
              v-model="nodeSpatial.positions.edgeWrap"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="updatePositions()"
          size="small"
          text="update positions"
        />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive } from "vue";

import ValueSlider from "@/components/controls/ValueSlider.vue";
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";
import { IParamProps } from "@/helpers/common/parameter";

const props = defineProps<{ nodeSpatial: NESTNodeSpatial }>();
const nodeSpatial = computed(() => props.nodeSpatial);

const state = reactive<{
  menuOpen: boolean;
  numDimensions: boolean;
  positions: { title: string; value: string }[];
  selectedPositions: string;
  sizeOptions: IParamProps;
}>({
  menuOpen: false,
  numDimensions: false,
  positions: [
    { title: "Free positions", value: "free" },
    { title: "Grid positions", value: "grid" },
  ],
  selectedPositions: "free",
  sizeOptions: {
    component: "valueSlider",
    id: "size",
    label: "population size",
    max: 1000,
    rules: [
      ["value > 0", "The value must be strictly positive.", "error"],
      [
        "value < 1000",
        "Large values generate many data points and can put quite a load on your browser.",
        "warning",
      ],
    ],
    value: 1,
  },
});

const initPositions = () => {
  nextTick(() => {
    nodeSpatial.value.init({
      positions: state.selectedPositions,
    });
  });
};

const updatePositions = () => {
  state.menuOpen = false;
  // node.value.spatial.positions?.generate();
  nodeSpatial.value.changes();
};

onMounted(() => {
  state.numDimensions = nodeSpatial.value.positions?.numDimensions === 3;
  state.selectedPositions = nodeSpatial.value.positions?.name || "free";
});
</script>
