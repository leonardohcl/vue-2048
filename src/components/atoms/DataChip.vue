<template>
  <v-chip v-bind="chipAttrs">
    <slot> {{ value }} </slot>
  </v-chip>
</template>

<script>
import { computed } from "vue";
const THEMES = {
  default: { variant: "outlined", size: "small" },
  score: { variant: "tonal" },
  run: { color: "light-green", prependIcon: "fas fa-fw fa-person-running" },
  moves: { prependIcon: "fas fa-fw fa-up-down-left-right" },
  undos: { prependIcon: "fas fa-fw fa-rotate-left" },
  board: { color: "primary", prependIcon: "fas fa-fw fa-table-cells" },
  coins: { color: "warning", appendIcon: "fas fa-fw fa-coins" },
};

export default {
  props: {
    value: { type: [String, Number], default: 0 },
    theme: { type: String, default: "" },
    text: { type: String, default: "" },
    chipOptions: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const chipAttrs = computed(() => {
      const theme = THEMES[props.theme] || {};
      return {
        ...THEMES.default,
        ...theme,
        ...props.chipOptions,
      };
    });

    return { chipAttrs };
  },
};
</script>