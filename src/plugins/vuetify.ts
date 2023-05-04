/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

import { mdi } from "vuetify/iconsets/mdi";
import { nest } from "@/components/iconsets/nest";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    global: {
      ripple: false,
    },
    VCard: {
      flat: true,
      VCardActions: {
        VBtn: { size: "small", variant: "outlined", ripple: true },
      },
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          "blue-darken-1": "#054766",
          "blue-lighten-1": "#33BEFF",
          "orange-darken-1": "#B33A12",
          "orange-lighten-1": "#FF794D",
          blue: "#1281b3",
          green: "#36B34F",
          orange: "#ff6633",
          pink: "#A93EB3",
          primary: "#1867C0",
          secondary: "#5CBBF6",
          systembar: "#424242",
          yellow: "#B3AE47",
        },
      },
      dark: {
        colors: {
          "blue-darken-1": "#054766",
          "blue-lighten-1": "#33BEFF",
          "orange-darken-1": "#B33A12",
          "orange-lighten-1": "#FF794D",
          blue: "#1281b3",
          green: "#36B34F",
          orange: "#ff6633",
          pink: "#A93EB3",
          primary: "#1867C0",
          secondary: "#5CBBF6",
          systembar: "#424242",
          yellow: "#B3AE47",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      nest,
    },
  },
});
