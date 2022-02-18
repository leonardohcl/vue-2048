<template>
  <div class="board" :style="boardStyle">
    <Square
      v-for="(sqr, idx) in board"
      :key="idx"
      :data="sqr"
      :transition-duration="transitionDuration"
      :gap="gap"
    />
  </div>
</template>

<script>
  import Square from '../atoms/Square.vue'

  export default {
    components: { Square },
    name: 'Board',
    props: {
      size: {
        type: Number,
        required: true,
      },
      board: {
        type: Array,
        required: true,
      },
      transitionDuration: {
        type: Number,
        required: true,
      },
      gap: {
        type: Number,
        default: 0.25,
      },
    },
    computed: {
      boardStyle() {
        return {
          'grid-template-rows': `repeat(${this.size}, min-content)`,
          'grid-template-columns': `repeat(${this.size}, min-content)`,
          gap: `${this.gap}em`,
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/base';

  .board {
    display: grid;
  }
</style>
