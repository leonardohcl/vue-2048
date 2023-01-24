<template>
  <div class="block-equalizer">
    <Btn
      v-if="allowDecrease"
      is-icon
      outlined
      :theme="theme"
      icon="fa-regular fa-minus-square"
      :disabled="disabled || current <= min"
      @click="$emit('decrease')"
    />
  <Square :data="{value: current}" inline/>
    <Btn
      v-if="allowIncrease"
      is-icon
      outlined
      :theme="theme"
      icon="fa-regular fa-plus-square"
      :disabled="disabled || current >= max"
      @click="$emit('increase')"
    />
  </div>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import Square from '@/components/atoms/Square.vue'

  export default {
    components: { Btn,Square },
    emits: ['increase', 'decrease'],
    props: {
      current: { type: Number, required: true },
      max: { type: Number },
      theme: { type: String, default: 'primary' },
      allowDecrease: { type: Boolean, default: true },
      allowIncrease: { type: Boolean, default: true },
      disabled: { type: Boolean, default: false },
    },
  }
</script>

<style lang="scss" scoped>
  .block-equalizer {
    display: flex;
    align-items: center;

    .btn {
      height: 1.3em !important;
      width: 1.5em !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__bars {
      display: flex;
      gap: 3px;
      width: 100%;
      align-items: center;
    }

    &__bar {
      flex: 1;
      height: 1.3em;
      background-color: $bg-secondary;
    }
  }
</style>
