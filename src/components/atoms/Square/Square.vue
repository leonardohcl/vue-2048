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

<script lang="ts">
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
      const nextMove = computed<{ horizontal: number; vertical: number }>(
        () =>
          props.meta[SquareTrackingMeta.NextMove] || {
            vertical: 0,
            horizontal: 0,
          }
      )

      const stepSize = computed(() => {
        const { horizontal, vertical } = nextMove.value
        return { horizontal, vertical }
      })

      const squareClasses = computed(() => ({
        'square--selectable': props.meta[SquareConsumableMeta.Selectable],
        'square--selected': props.meta[SquareConsumableMeta.Selected],
      }))

      const getBlockClasses = () => {
        const classes = [
          `square__block--${props.value}`,
          props.meta[SquareTrackingMeta.IsReverse] && 'square__block--reverse',
          props.meta[SquareConsumableMeta.Frozen] && 'square__block--frozen',
        ]

        if (props.meta[SquareStateMeta.InvalidMove]) return classes

        if (props.meta[SquareConsumableMeta.Broken])
          classes.push(`square__block--break`)
        else if (props.meta[SquareConsumableMeta.Upgraded])
          classes.push(`square__block--upgrade`)
        else if (props.meta[SquareConsumableMeta.Shrunk])
          classes.push(`square__block--shrink`)
        else if (props.meta[SquareStateMeta.Spawned])
          classes.push(`square__block--spawn`)
        else if (props.meta[SquareStateMeta.Merged])
          classes.push(`square__block--merged`)

        return classes
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

        const { horizontal, vertical } = stepSize.value

        const transforms: { dir: 'top' | 'left'; step: number }[] = [
          { dir: 'left', step: horizontal },
          { dir: 'top', step: vertical },
        ]
        const transitions: string[] = []

        transforms.forEach((axis) => {
          if (axis.step === 0) return
          const transform = `calc(${axis.step * -100}% + ${
            axis.step * -props.gap
          }px)`
          styles[axis.dir] = transform
          transitions.push(`${axis.dir} ${props.transitionDuration}ms ease`)
        })

        styles.transition = transitions.join(', ')

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
  $upgrade-pulse-color: green;
  $shrink-pulse-color: red;

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

      &--frozen {
        box-shadow: 0 0 3px 5px rgba(255, 255, 255, 0.5) inset;
      }

      &--merged {
        animation-name: pop;
        animation-direction: alternate-reverse;
      }

      &--break {
        animation-name: despawn;
        animation-duration: 500ms !important;
      }

      &--upgrade {
        animation-name: upgrade-pulse;
        animation-duration: 500ms !important;
        animation-fill-mode: backwards;
      }

      &--shrink {
        animation-name: shrink-pulse;
        animation-duration: 500ms !important;
        animation-fill-mode: backwards;
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

  @keyframes despawn {
    100% {
      transform: translate(100%,-100%) scale(2) rotate(360deg) rotateY(720deg);
      opacity: 0;
    }
  }

  @keyframes pop {
    100% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes shrink-pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 fade-out($shrink-pulse-color, 0.1);
    }
    25% {
      transform: scale(0.8);
    }
    70% {
      box-shadow: 0 0 0 15px fade-out($shrink-pulse-color, 1);
    }

    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 fade-out($shrink-pulse-color, 1);
    }
  }

  @keyframes upgrade-pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 fade-out($upgrade-pulse-color, 0.1);
    }
    25% {
      transform: scale(1.2);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 15px fade-out($upgrade-pulse-color, 1);
    }

    100% {
      box-shadow: 0 0 0 0 fade-out($upgrade-pulse-color, 1);
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
