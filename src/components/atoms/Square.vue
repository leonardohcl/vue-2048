<template>
  <div class="square">
    <Transition name="square__block">
      <div class="square__block" :class="blockClasses" v-if="data.value">
        {{ data.value }}
      </div>
    </Transition>
  </div>
</template>

<script>
import Square from "../../model/Square";

export default {
  name: "Square",
  props: {
    data: {
      type: Square,
      required: true,
    },
  },
  computed: {
    blockClasses() {
      return [`square__block--${this.data.value}`];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/base";

.square {
  width: $square-size;
  height: $square-size;
  border-radius: $square-border-radius;
  background-color: $square-color;

  &__block {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;

    @each $key, $value in $block-colors {
      &--#{$key} {
        background-color: $value;
      }
    }

    &-enter-active {
      animation: bounce-in 0.2s;
    }
    &-leave-active {
      animation: bounce-in 0.2s reverse;
    }
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>