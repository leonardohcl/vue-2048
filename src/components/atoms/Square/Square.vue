<template>
  <div class="square" :id="id" :class="squareClasses" @click="handleClick">
    <div
      v-show="value"
      class="square__block"
      :class="blockClasses"
      :style="blockStyles"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
  import { SquareTrackingMeta } from '@/model/2048 Standard/interfaces/Square'
  import { SquareStateMeta } from '@/model/2048/interfaces/Square'
  import { SquareConsumableMeta } from '@/model/Game Utils/Item/interfaces/Square'
  import { computed } from 'vue'

  export default {
    name: 'Square',
    props: {
      id: { type: String, default: '' },
      value: { type: Number, required: true },
      meta: {
        type: Object,
        default: () => ({}),
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
    setup(props, context) {
      if (props.inline) {
        const blockClasses = computed(() => {
          return [`square__block--${props.value}`]
        })
        return {
          squareClasses: ['square--inline'],
          blockClasses,
          blockStyles: {},
        }
      }
      const nextMove = computed(
        () =>
          props.meta[SquareTrackingMeta.NextMove] || {
            vertical: 0,
            horizontal: 0,
          }
      )

      const stepSize = computed(() => {
        const { horizontal, vertical } = nextMove.value
        return horizontal || vertical
      })

      const isReverse = computed(() => {
        return props.meta[SquareTrackingMeta.IsReverse] || false
      })

      const squareClasses = computed(() => ({
        'square--selectable': props.meta[SquareConsumableMeta.Selectable],
        'square--selected': props.meta[SquareConsumableMeta.Selected],
      }))

      const getBlockClasses = () => {
        return {
          [`square__block--${props.value}`]: true,
          'square__block--spawn':
            props.meta[SquareStateMeta.Spawned] &&
            !props.meta[SquareStateMeta.InvalidMove],
          'square__block--merged':
            props.meta[SquareStateMeta.Merged] &&
            !props.meta[SquareStateMeta.InvalidMove],
          'square__block--reverse': isReverse.value,
          'square__block--locked': props.meta[SquareStateMeta.Locked],
        }
      }

      const blockClasses = computed(getBlockClasses)

      const blockStyles = computed(() => {
        if (!props.value) return {}

        const styles = {
          transition: '',
          transform: '',
          top: '',
          left: '',
          animationDuration: `${props.transitionDuration}ms`,
          'font-size': `${
            props.value >= 1000 ? 0.9 : props.value > 100 ? 1.1 : 1.3
          }em`,
        }

        if (stepSize.value) {
          const transform = `calc(${stepSize.value * -100}% + ${
            stepSize.value * -props.gap
          }px)`

          const dir = nextMove.value.horizontal ? 'left' : 'top'
          styles[dir] = transform
          styles.transition = `${dir} ${props.transitionDuration}ms ease`
        }

        return styles
      })

      const handleClick = () => {
        if (props.meta[SquareConsumableMeta.Selectable]) context.emit('click')
      }

      return {
        squareClasses,
        blockClasses,
        blockStyles,
        handleClick,
      }
    },
  }
</script>

<style lang="scss">
  $pulse-color: white;

  .square {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: $border-radius;
    background-color: fade-out($square-color, 0.8);
    font-size: 0.9rem;

    &--inline {
      padding-top: 2rem;
      width: 2rem;
      font-size: 0.8em;
    }

    &--selectable {
      animation: pulse 1.5s infinite;
    }

    &--selected {
      animation: none;
      transform: scale(0.9);
      box-shadow: 0 0 12px 3px $pulse-color;
    }

    &__block {
      position: absolute;
      z-index: 1;
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
      animation-fill-mode: forwards;

      &--spawn {
        transform: scale(0.1);
        opacity: 0.3;
        animation-name: spawn;
      }

      &--reverse {
        animation-name: slide-back;
      }

      &--locked {
        box-shadow: 0 0 3px 5px rgba(255, 255, 255, 0.5) inset;
      }

      &--merged {
        animation-name: pop;
        animation-direction: alternate-reverse;
      }

      @each $key, $value in $block-colors {
        &--#{$key} {
          background-color: $value;
        }
      }
    }

    @include screen-above(md) {
      font-size: 1rem;
    }
    @include screen-above(lg) {
      font-size: 1.2rem;
    }
  }

  @keyframes spawn {
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pop {
    100% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes slide-back {
    100% {
      left: 0;
      top: 0;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 fade-out($pulse-color, 0.1);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px fade-out($pulse-color, 1);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 fade-out($pulse-color, 1);
    }
  }
</style>
