<template>
  <div class="board" :style="boardStyle" :class="[inline && 'board--inline']">
    <Square
      v-for="(sqr, idx) in board.squares"
      :key="idx"
      :data="sqr"
      :transition-duration="transitionDuration"
      :gap="gap"
      :inline="inline"
      @click="handleSquareClick"
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

      const handleSquareClick = sqr => {
        context.emit('square-selected', sqr)
      }

      return {
        boardStyle,
        handleSquareClick
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
