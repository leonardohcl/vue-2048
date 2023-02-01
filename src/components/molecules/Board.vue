<template>
  <div class="board" :style="boardStyle" :class="[inline && 'board--inline']">
    <Square
      v-for="sqr in board.squares"
      :key="sqr.id"
      :id="sqr.id"
      :transition-duration="transitionDuration"
      :gap="gap"
      :inline="inline"
      v-bind="sqr"
      @click="handleSquareClick(sqr)"
    />
  </div>
</template>

<script>
  import Board from '@/model/2048/Board'
  import Square from '@/components/atoms/Square.vue'
  import { computed } from 'vue'

  export default {
    components: { Square },
    name: 'Board',
    props: {
      board: {
        type: [Board, Object],
        required: true,
      },
      transitionDuration: {
        type: Number,
        default: 0,
      },
      gap: {
        type: Number,
        default: 0.25,
      },
      inline: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["squareSelected"],
    setup(props, context) {
      const boardStyle = computed(() => {
        const { width, height } = props.board

        const styles = {
          'grid-template-rows': `repeat(${height}, 1fr)`,
          'grid-template-columns': `repeat(${width}, 1fr)`,
          gap: `${props.gap}em`,
          padding: `${props.gap}em`,
        }

        return styles
      })

      const handleSquareClick = (sqr) => {
        context.emit('squareSelected', sqr)
      }

      return {
        boardStyle,
        handleSquareClick,
      }
    },
  }
</script>

<style lang="scss">
  .board {
    background-color: $bg-secondary;
    border-radius: $border-radius;
    display: grid;
    width: 100%;

    &--inline {
      width: auto;
    }
  }
</style>
