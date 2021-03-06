<template>
  <div class="parameterEdit">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.menu.position.x"
      :position-y="state.menu.position.y"
      :value="state.menu.show"
      dense
      transition="slide-y-transition"
    >
      <v-card :min-width="300" flat tile>
        <v-card-subtitle class="pb-0" v-text="state.options.label" />

        <span v-if="state.content === null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
              v-show="item.visible"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
              <v-list-item-action v-if="item.actions.length > 0">
                <v-row>
                  <span
                    :key="'action' + action.id"
                    class="mx-1"
                    v-for="action in item.actions"
                  >
                    <v-switch
                      :value="action.value()"
                      :color="state.color"
                      dense
                      hide-details
                      v-if="action.id === 'switch'"
                    />
                  </span>
                </v-row>
              </v-list-item-action>
              <v-list-item-action v-if="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'generateValues'">
          <v-card-text>
            <v-select
              :items="state.valueGenerator.types"
              dense
              hide-details
              v-model="state.valueGenerator.type"
            />
            <v-row no-gutters>
              <v-col
                :key="param.id"
                class="mx-1"
                v-for="param in state.valueGenerator.options"
                v-show="param.visible"
              >
                <v-text-field
                  :label="param.label"
                  class="mt-5"
                  dense
                  hide-details
                  type="number"
                  v-model="state.valueGenerator.params[param.id]"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="backMenu" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="generateValues" text v-text="'Generate'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>

    <v-card @contextmenu="e => showMenu(e)" color="white" flat light tile>
      <v-row class="px-1 my-0" no-gutters>
        <v-col cols="12">
          <template v-if="state.expertMode">
            <ParameterEditExpert
              :param="state.param"
              @update:param="paramExpertChange"
            />
          </template>

          <template v-else>
            <template v-if="state.options.input === 'arrayInput'">
              <v-textarea
                :label="label()"
                :row-height="12"
                :rows="1"
                @change="paramChange()"
                auto-grow
                class="my-1"
                hide-details
                outlined
                small
                v-model="state.value"
              />
            </template>

            <template v-if="state.options.input === 'checkbox'">
              <v-checkbox
                :color="state.color"
                :readonly="state.options.readonly"
                :label="label()"
                @change="paramChange()"
                class="ma-1"
                dense
                hide-details
                v-model="state.value"
              />
            </template>

            <template v-if="state.options.input === 'tickSlider'">
              <v-subheader class="paramLabel" v-text="label()" />
              <v-slider
                :max="state.options.ticks.length - 1"
                :thumb-color="state.color"
                :tick-labels="state.options.ticks"
                @change="paramChange"
                class="mb-1"
                dense
                height="40"
                hide-details
                ticks="always"
                tick-size="4"
                :value="state.value"
              />
            </template>

            <template v-if="state.options.input === 'valueInput'">
              <v-text-field
                :label="label()"
                @blur="e => paramChange(e.target.value)"
                @change="paramChange"
                auto-grow
                hide-details
                outlined
                small
                :value="state.value"
              />
            </template>

            <template v-if="state.options.input === 'valueSlider'">
              <v-subheader class="paramLabel" v-text="label()" />
              <v-slider
                :max="state.options.max || 1"
                :min="state.options.min || 0"
                :step="state.options.step || 1"
                :thumb-color="state.color"
                @change="paramChange"
                dense
                height="40"
                hide-details
                :value="state.value"
              >
                <template #append>
                  <v-text-field
                    @blur="e => paramChange(e.target.value)"
                    @change="paramChange"
                    :step="state.options.step || 1"
                    class="mt-0 pt-0"
                    height="32"
                    hide-details
                    single-line
                    style="width: 60px; font-size: 12px"
                    type="number"
                    :value="state.value"
                  />
                </template>
              </v-slider>
            </template>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { ValueGenerator } from '@/core/parameter/valueGenerator';

import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';
import ParameterEditExpert from '@/components/parameter/ParameterEditExpert.vue';

export default Vue.extend({
  name: 'ParameterEdit',
  components: {
    ParameterEditExpert,
  },
  props: {
    color: String,
    value: [Object, Array, Number, String, Boolean],
    param: [ModelParameter, Parameter],
    options: Object,
  },
  setup(props, { emit }) {
    const state = reactive({
      color: props.color,
      content: null,
      expertMode: false,
      items: [
        {
          actions: [],
          icon: 'mdi-refresh',
          title: 'Set default value',
          onClick: () => {
            state.param.reset();
            state.param.paramChanges();
            closeMenu();
          },
          visible: true,
        },
        {
          actions: [],
          append: true,
          icon: 'mdi-numeric',
          title: 'Generate values',
          onClick: () => {
            state.content = 'generateValues';
          },
          visible: true,
        },
        {
          actions: [
            {
              id: 'switch',
              value: () => state.expertMode,
            },
          ],
          icon: '$diceMultipleOutline',
          title: 'Expert mode',
          onClick: () => {
            state.param.value = state.value;
            state.param.type = 'constant';
            state.expertMode = !state.expertMode;
            // paramChange();
          },
          visible: true,
        },
        {
          actions: [],
          icon: 'mdi-eye-off-outline',
          title: 'Hide parameter',
          onClick: () => {
            state.param.visible = false;
            state.param.paramChanges();
            closeMenu();
          },
          visible: true,
        },
      ],
      menu: {
        show: false,
        position: {
          x: 0,
          y: 0,
        },
      },
      options: props.param ? props.param['options'] : props.options,
      param: props.param as ModelParameter | Parameter | undefined,
      value: undefined,
      valueGenerator: new ValueGenerator(),
    });

    /**
     * Serialize for view.
     */
    const serialize = (value: any) => {
      switch (state.options.input) {
        case 'tickSlider':
          return state.options.ticks.indexOf(value);
        default:
          return value;
      }
    };

    /**
     * Deserialize for data objects.
     */
    const deserialize = (value: any) => {
      switch (state.options.input) {
        case 'tickSlider':
          return state.options.ticks[value]; // returns tick values
        case 'arrayInput':
          if (typeof value === 'string') {
            return value.startsWith('[') && value.endsWith(']')
              ? JSON.parse(value)
              : JSON.parse(`[${value}]`); // returns array
          } else {
            return value;
          }
        default:
          return value;
      }
    };

    const generateValues = () => {
      state.value = state.valueGenerator.generate();
      paramChange();
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = (value: any = undefined) => {
      let changed: boolean = true;
      if (typeof value === 'number') {
        // slider
        changed = state.value !== value;
        state.value = value;
      } else if (typeof value === 'string') {
        // text field
        changed = state.value !== Number(value);
        state.value = Number(value);
      }
      if (changed) {
        emit('update:value', deserialize(state.value));
      }
    };

    /**
     * Triggers when parameter in expert mode is changed.
     */
    const paramExpertChange = () => {
      state.expertMode = !state.param.isConstant();
      state.param.paramChanges();
    };

    /**
     * Show parameter menu.
     */
    const showMenu = function (e: MouseEvent) {
      if (this.param) {
        // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
        e.preventDefault();
        state.menu.show = false;
        state.menu.position.x = e.clientX;
        state.menu.position.y = e.clientY;
        this.$nextTick(() => {
          state.content = null;
          state.menu.show = true;
        });
      }
    };

    /**
     * Parameter label.
     */
    const label = () => {
      return state.param ? state.param.title : state.options.label;
    };

    /**
     * Return to main menu content.
     */
    const backMenu = () => {
      state.content = null;
    };

    /**
     * Close menu.
     */
    const closeMenu = () => {
      state.content = null;
      state.menu.show = false;
    };

    /**
     * Update param and expert mode.
     */
    const update = () => {
      state.color = props.color;
      state.value = serialize(props.value);
      if (props.param) {
        state.options = props.param['options'];
        state.param = props.param as ModelParameter | Parameter;
        state.expertMode = !state.param.isConstant();
        state.items[1].visible = 'arrayInput' === state.options.input;
        state.items[2].visible = ['valueSlider', 'arrayInput'].includes(
          state.options.input
        );
      } else {
        state.options = props.options;
      }
    };

    onMounted(() => {
      update();
    });

    watch(
      () => [props.color, props.options, props.param, props.value],
      () => {
        update();
      }
    );

    return {
      backMenu,
      generateValues,
      label,
      paramChange,
      paramExpertChange,
      showMenu,
      state,
    };
  },
});
</script>

<style>
.parameterEdit .v-text-field {
  font-size: 12px;
}

.parameterEdit .v-textarea textarea {
  line-height: 1.4em !important;
}

.parameterEdit .v-slider__tick {
  font-size: 11px;
}
</style>
