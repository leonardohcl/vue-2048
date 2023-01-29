<template>
  <div class="block-equalizer">
    <v-btn
      v-if="allowDecrease"
      class="pa-0 mr-2"
      v-bind="btnOptions"
      prepend-icon="fa-fw far fa-minus-square"
      :disabled="disabled || current <= min"
      @click="$emit('decrease')"
      />
      <Square :value="current" inline />
      <v-btn
      v-if="allowIncrease"
      class="pa-0 ml-2"
      v-bind="btnOptions"
      prepend-icon="fa-fw far fa-plus-square"
      :disabled="disabled || current >= max"
      @click="$emit('increase')"
    />
  </div>
</template>

<script>
import Square from "@/components/atoms/Square.vue";

export default {
  components: { Square },
  emits: ["increase", "decrease"],
  props: {
    current: { type: Number, required: true },
    max: { type: Number },
    color: { type: String, default: "primary" },
    allowDecrease: { type: Boolean, default: true },
    allowIncrease: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    btnOptions() {
      return {
        variant: 'text',
        color: this.color,
        size: "small",
      };
    },
  },
};
</script>

<style lang="scss">
.block-equalizer {
  display: flex;
  align-items: center;
}
</style>
