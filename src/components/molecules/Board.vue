<template>
  <div class="board" :class="[inline && 'board--inline']" ref="container">
    <div class="board__container" :style="boardStyle">
      <Square
        v-for="sqr in board.squares"
        v-bind="sqr"
        :id="sqr.id"
        :value="sqr.value"
        :key="sqr.id"
        :transition-duration="transitionDuration"
        :gap="gap"
        :inline="inline"
        @click="handleSquareClick(sqr)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import Board from '@/model/2048/Board'
  import Square from '@/components/atoms/Square/Square.vue'
  import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
  import SquareClass from '@/model/2048/Square'
  import LooseObject from '@/utils/LooseObject'

  export default {
    components: { Square },
    name: 'Board',
    props: {
      board: {
        type: Board,
        required: true,
      },
      transitionDuration: {
        type: Number,
        default: 0,
      },
      gap: {
        type: Number,
        default: 4,
      },
      inline: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['squareSelected'],
    setup(props, context) {
      const container = ref<HTMLDivElement | undefined>()

      const getContainerWidth = () => {
        const { width = 0 } = container.value?.getBoundingClientRect() ?? {}
        return width
      }

      const width = computed(() => props.board.width)
      const height = computed(() => props.board.height)

      const getBoardStyle = (
        width = props.board.width,
        height = props.board.height
      ) => {
        const gap = props.gap
        const containerWidth = getContainerWidth()

        const largestDimension = width > height ? width : height

        const availableSpace =
          containerWidth - (largestDimension + 1) * props.gap

        const squareSide = availableSpace / largestDimension

        const boardWidth = gap + (squareSide + gap) * width
        const boardHeight = gap + (squareSide + gap) * height

        const styles = {
          height: `${boardHeight}px`,
          width: `${boardWidth}px`,
          'grid-template-rows': `repeat(${height}, ${squareSide}px)`,
          'grid-template-columns': `repeat(${width}, ${squareSide}px)`,
          gap: `${props.gap}px`,
          padding: `${props.gap}px`,
        }

        return styles
      }

      const boardStyle = ref<LooseObject>(getBoardStyle())

      const staggerTimeouts: { [key: string]: NodeJS.Timeout | null } = {
        updateBoard: null,
      }

      const updateBoardSize = () => {
        if (staggerTimeouts.updateBoard)
          clearTimeout(staggerTimeouts.updateBoard)
        staggerTimeouts.updateBoard = setTimeout(() => {
          boardStyle.value = getBoardStyle()
        }, 200)
      }

      const handleSquareClick = (sqr: SquareClass) => {
        context.emit('squareSelected', sqr)
      }

      onMounted(() => {
        updateBoardSize()

        window.addEventListener('resize', updateBoardSize)
      })

      onBeforeUnmount(() => {
        window.removeEventListener('resize', updateBoardSize)
      })

      watch([width, height], (newDimensions, oldDimensions) => {
        if (
          newDimensions[0] != oldDimensions[0] ||
          newDimensions[1] != oldDimensions[1]
        )
          boardStyle.value = getBoardStyle()
      })

      return {
        boardStyle,
        container,
        handleSquareClick,
      }
    },
  }
</script>

<style lang="scss">
  .board {
    width: 100%;
    border-radius: $border-radius;
    display: flex;
    justify-content: center;

    &--inline {
      width: auto;
    }

    &__container {
      background-color: $bg-secondary;
      display: grid;
      align-items: center;
      justify-content: center;
      transition: width 750ms, height 750ms;
    }
  }
</style>
