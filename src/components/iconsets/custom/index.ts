// iconsets/custom

import type { IconSet, IconProps } from "vuetify";
import { Component, h } from "vue";

import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";
import sliderIcon from "./SliderIcon.vue";

const customSvgNameToComponent: Record<string, string | Component> = {
  "dice-multiple-outline": diceMultipleOutlineIcon,
  "dots-grid": dotsGridIcon,
  slider: sliderIcon,
};

const custom: IconSet = {
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon as string]),
};

export { custom };
