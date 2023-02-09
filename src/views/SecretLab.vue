<template>
  <div class="secret-lab">
    <div class="text-center">
      score: {{ game.score }} <br />
      winner: {{ game.winner }} <br />
      gameOver: {{ game.gameOver }}
    </div>
    <div class="d-flex justify-center mt-2 mb-2">
      <v-btn @click="shouldStop = true">Stop</v-btn>
      <v-btn @click="start">Start</v-btn>
    </div>
    <div
      class="secret-lab__board"
      :style="`grid-template-columns: repeat(${game.width}, max-content);
    grid-template-rows: repeat(${game.height}, max-content);`"
    >
      <Square
        inline
        v-for="sqr in game.board.squares"
        :key="sqr.id"
        :value="sqr.value"
      />
    </div>
    <div class="text-center">
      scenarios: {{ scenarios }} <br />
      look ahead timeout: {{ lookAheadTimeout }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeUnmount } from "vue";
import Board from "@/components/molecules/Board.vue";
import Game from "@/model/2048/Game";
import MonteCarloSearchTree from "@/model/AI/MonteCarloTreeSearch";
import Square from "@/components/atoms/Square.vue";

export default {
  components: { Board, Square },
  setup() {
    const game = ref(new Game({ width: 4, height: 4, winningBlock: 2048 }));

    const shouldStop = ref(true);
    const scenarios = 10;
    const lookAheadTimeout = 50;

    const start = async () => {
      shouldStop.value = false;
      await MonteCarloSearchTree.playGame(
        game.value as Game,
        scenarios,
        lookAheadTimeout,
        () => shouldStop.value
      );
    };

    onBeforeUnmount(() => {
      shouldStop.value = true;
    });

    return { game, scenarios, lookAheadTimeout, start, shouldStop };
  },
};
</script>

<style lang="scss">
.secret-lab {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;

  &__board {
    display: grid;
    justify-content: center;
    gap: 5px;
  }
}
</style>
