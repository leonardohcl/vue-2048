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
  import Square from '@/model/2048/Square'
  import { computed } from 'vue'

  export default {
    name: 'Square',
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
    setup(props) {
      const stepSize = computed(() => {
        const { horizontal, vertical } = props.data.nextMove
        return horizontal || vertical
      })

      const isReverse = computed(() => {
        return props.data.nextMove.reverse
      })

      const blockClasses = computed(() => {
        return [
          `square__block--${props.data.value}`,
          props.data.nextMove.spawn && 'square__block--spawn',
          props.data.nextMove.reverse && 'square__block--reverse',
        ]
      })

      const blockStyles = computed(() => {
        if (!props.data.value) return {}

        const styles = {
          trasition: '',
          transform: '',
          top: '',
          left: '',
          animationDuration: '',
          'font-size': `${
            props.data.value >= 1000 ? 1 : props.data.value > 100 ? 1.2 : 1.3
          }em`,
        }

        if (stepSize.value) {
          const transform = `calc(${stepSize.value * -100}% + ${
            stepSize.value * -props.gap
          }rem)`

          if (isReverse.value) {
            if (props.data.nextMove.horizontal) {
              styles.left = `${transform}`
            } else {
              styles.top = `${transform}`
            }
            styles.animationDuration = `${props.transitionDuration}ms`
          } else {
            styles.transition = `transform ${props.transitionDuration}ms ease-out`

            if (props.data.nextMove.horizontal) {
              styles.transform = `translateX(${transform})`
            } else {
              styles.transform = `translateY(${transform})`
            }
          }
        }

        return styles
      })

      return {
        blockClasses,
        blockStyles,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .square {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: $border-radius;
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
        width: 10%;
        height: 10%;
        left: 45%;
        top: 45%;
        opacity: 0.3;
        animation: spawn;
        animation-fill-mode: forwards;
        animation-duration: 200ms;
      }

      &--reverse {
        animation-name: slide-back;
        animation-fill-mode: forwards;
      }

      @each $key, $value in $block-colors {
        &--#{$key} {
          background-color: $value;
        }
      }
    }
  }

  @keyframes spawn {
    100% {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 1;
    }
  }

  @keyframes slide-back {
    100% {
      left: 0;
      top: 0;
    }
  }
</style>
