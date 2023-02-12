import "@fortawesome/fontawesome-free/css/all.css";
import { createVuetify, ThemeDefinition } from "vuetify";
import { fa } from "vuetify/iconsets/fa";
import {
  VIcon,
  VTooltip,
  VBadge,
  VChip,
  VProgressCircular,
  VCard,
  VCardText,
  VCardActions,
  VBtn,
  VBtnToggle,
  VDialog,
  VSpacer,
  VSlider,
  VSwitch,
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
} from "vuetify/components";

const game2048: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#1b1b1e",
    "on-background": "#FFF",
    surface: "#1f2430",
    "on-surface": "#FFF",
    "surface-variant": "#1b1b1e",
    "on-surface-variant": "#FFF",
    primary: "#00a7da",
    "on-primary": "#000",
    secondary: "#4361ee",
    "on-secondary": "#000",
    error: "#f72553",
    warning: "#F9CB40",
  },
};

export default createVuetify({
  defaults: {
    global: { ripple: false },
    VDialog: {
      scrim: "black",
    },
    VOverlay: {
      scrim: "black",
    },
  },
  components: {
    VIcon,
    VTooltip,
    VBadge,
    VChip,
    VProgressCircular,
    VCard,
    VCardText,
    VCardActions,
    VBtn,
    VBtnToggle,
    VDialog,
    VSpacer,
    VSlider,
    VSwitch,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
  },
  theme: {
    defaultTheme: "game2048",
    themes: { game2048 },
  },
  icons: {
    defaultSet: "fa",
    sets: { fa },
  },
});
