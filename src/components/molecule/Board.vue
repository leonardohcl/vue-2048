<template>
  <div class="board" :style="boardStyle">
    <Square
      v-for="(sqr, idx) in board.squares"
      :key="idx"
      :data="sqr"
      :transition-duration="transitionDuration"
      :gap="gap"
    />
  </div>
</template>

<script>
import Board from "@/model/2048/Board";
import Square from "@/components/atoms/Square.vue";

export default {
  components: { Square },
  name: "Board",
  props: {
    size: {
      type: Number,
      required: true,
    },
    board: {
      type: [Board, Object],
      required: true,
    },
    transitionDuration: {
      type: Number,
      default: 0
    },
    gap: {
      type: Number,
      default: 0.25,
    },
  },
  computed: {
    boardStyle() {
      return {
        "grid-template-rows": `repeat(${this.size}, 1fr)`,
        "grid-template-columns": `repeat(${this.size}, 1fr)`,
        gap: `${this.gap}em`,
        padding: `${this.gap}em`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/base";

.board {
  background-color: $bg-surface;
  border-radius: $square-border-radius;
  display: grid;
  width: 100%;
}
</style>
