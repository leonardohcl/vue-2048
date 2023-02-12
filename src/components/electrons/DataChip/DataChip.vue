<template>
  <v-chip v-bind="chipAttrs">
    <slot> {{ value }} </slot>
  </v-chip>
</template>

<script>
import { computed } from "vue";
import THEMES from "./themes.json"

export default {
  props: {
    value: { type: [String, Number], default: 0 },
    theme: { type: String, default: "" },
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