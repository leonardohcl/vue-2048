<template>
  <div class="bar-equalizer">
    <Btn
      v-if="allowDecrease"
      is-icon
      outlined
      :theme="theme"
      icon="fa-regular fa-minus-square"
      :disabled="disabled || current === min"
      @click="$emit('decrease')"
    />
    <div class="bar-equalizer__bars">
      <div
        class="bar-equalizer__bar bar-equalizer__bar--filled"
        :class="filledBarClass"
        v-for="filled in current"
        :key="filled"
      />
      <div
        class="bar-equalizer__bar bar-equalizer__bar--empty"
        v-for="empty in emptySquares"
        :key="empty"
      ></div>
    </div>
    <Btn
      v-if="allowIncrease"
      is-icon
      outlined
      :theme="theme"
      icon="fa-regular fa-plus-square"
      :disabled="disabled || current === max"
      @click="$emit('increase')"
    />
  </div>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import { computed } from 'vue'

  export default {
    components: { Btn },
    emits: ['increase', 'decrease'],
    props: {
      current: { type: Number, required: true },
      max: { type: Number, required: true },
      theme: { type: String, default: 'primary' },
      allowDecrease: { type: Boolean, default: true },
      allowIncrease: { type: Boolean, default: true },
      disabled: { type: Boolean, default: false },
    },
    setup(props) {
      const emptySquares = computed(() => props.max - props.current)
      const filledBarClass = computed(() => [`bg-${props.theme}`])
      return { emptySquares, filledBarClass }
    },
  }
</script>

<style lang="scss" scoped>
  .bar-equalizer {
    width: 100%;
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
      gap: 1px;
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
