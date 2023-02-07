<template>
  <v-btn v-bind="options" :disabled="!canAfford">
    {{ price }}
  </v-btn>
</template>

<script>
import DataChip from "@/components/atoms/DataChip/DataChip.vue";
export default {
  components: { DataChip },
  props: {
    price: { type: Number, default: 0 },
    canAfford: { type: Boolean, default: false },
  },
  computed: {
    options() {
      return {
        size: "small",
        variant: "flat",
        color: this.canAfford ? "warning" : "dark",
        prependIcon: "fas fa-fw fa-coins",
        rounded: "pill",
      };
    },
  },
};
</script>
