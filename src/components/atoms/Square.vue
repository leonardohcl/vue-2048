<template>
  <div class="square">
    <div
      class="square__block"
      :class="blockClasses"
      :style="blockStyles"
      v-if="data.value"
    >
      {{ data.value }}
    </div>
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
    transitionDuration: {
      type: Number,
      required: true,
    },
    gap: {
      type: Number,
      required: true,
    },
  },
  computed: {
    stepSize() {
      return this.data.nextMove.horizontal || this.data.nextMove.vertical;
    },
    blockClasses() {
      return [
        `square__block--${this.data.value}`,
        this.data.nextMove.spawn && "square__block--spawn",
      ];
    },
    blockStyles() {
      const styles = {
        trasition: "",
        transform: "",
        "animation-duration": `${this.transitionDuration}ms`,
        "font-size": `${
          this.data.value >= 1000 ? 1 : this.data.value > 100 ? 1.2 : 1.3
        }em`,
      };
      if (this.stepSize) {
        styles.transition = `transform ${this.transitionDuration}ms ease-out`;

        const transform = `calc(${this.stepSize * -100}% + ${
          this.stepSize * -this.gap
        }em)`;

        if (this.data.nextMove.horizontal) {
          styles.transform = `translateX(${transform})`;
        } else {
          styles.transform = `translateY(${transform})`;
        }
      }
      return styles;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/base";

.square {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: $square-border-radius;
  background-color: fade-out($square-color, 0.8);
  font-size: 1.3rem;

  &__block {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(0, 0);
    position: absolute;

    &--spawn {
      animation: spawn;
    }

    @each $key, $value in $block-colors {
      &--#{$key} {
        background-color: $value;
      }
    }
  }
}

@keyframes spawn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
