<template>
  <div class="game">
    <div class="game__overlay">
      <button class="game_control" @click="game.start()">New Game</button>
    </div>
    <div class="game__score">Score: {{ game.score }}</div>
    <Board :board="game.board" :size="game.size" />
    <div class="game__controls">
      <button
        class="game_control"
        @click="game.move('left')"
        :disabled="game.isOver || !game.canMoveLeft"
      >
        left
      </button>
      <button
        class="game_control"
        @click="game.move('up')"
        :disabled="game.isOver || !game.canMoveUp"
      >
        up
      </button>
      <button
        class="game_control"
        @click="game.move('down')"
        :disabled="game.isOver || !game.canMoveDown"
      >
        down
      </button>
      <button
        class="game_control"
        @click="game.move('right')"
        :disabled="game.isOver || !game.canMoveRight"
      >
        right
      </button>
    </div>
  </div>
</template>

<script>
import Game from "../../model/GameController";
import Board from "../molecule/Board.vue";

export default {
  components: { Board },
  name: "Game",
  props: {
    game: {
      type: Game,
      required: true,
    },
  },
};
</script>