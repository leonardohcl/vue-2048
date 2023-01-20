<template>
  <div class="square" :class="squareClasses" @click="$emit('click', data)">
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
        type: [Square, Object],
        required: true,
      },
      transitionDuration: {
        type: Number,
        default: 0,
      },
      gap: {
        type: Number,
        default: 0,
      },
      inline: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    setup(props) {
      if (props.inline) {
        const blockClasses = computed(() => {
          return [`square__block--${props.data.value}`]
        })
        return {
          squareClasses: ['square--inline'],
          blockClasses,
          blockStyles: {},
        }
      }

      const stepSize = computed(() => {
        const { horizontal, vertical } = props.data.nextMove
        return horizontal || vertical
      })

      const isReverse = computed(() => {
        return props.data.nextMove.reverse
      })

      const blockClasses = computed(() => {
        return {
          [`square__block--${props.data.value}`]: true,
          'square__block--spawn':
            props.data.nextMove.spawn && !props.data.nextMove.reverse,
          'square__block--reverse': props.data.nextMove.reverse,
        }
      })

      const blockStyles = computed(() => {
        if (!props.data.value) return {}

        const styles = {
          transition: '',
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

          const dir = props.data.nextMove.horizontal ? 'left' : 'top'
          styles[dir] = transform
          styles.transition = `${dir} ${props.transitionDuration}ms ease`

          if (isReverse.value) {
            styles.animationDuration = `${props.transitionDuration}ms`
          }
        }

        return styles
      })

      return {
        squareClasses: {},
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

    &--inline {
      padding-top: 2rem;
      width: 2rem;
      font-size: 0.8em;
    }

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
      position: absolute;
      animation-fill-mode: forwards;

      &--spawn {
        transform: scale(0.1);
        opacity: 0.3;
        animation-name: spawn;
        animation-duration: 200ms;
      }

      &--reverse {
        animation-name: slide-back;
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
      transform: scale(1);
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
