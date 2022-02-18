<template>
  <div class="game">
    <div class="game__overlay">
      <button class="game_control" @click="game.start()">New Game</button>
    </div>
    <div class="game__score">Score: {{ game.score }}</div>
    <Board :board="game.board" :size="game.size" :transition-duration="game.updateDelay"/>
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

    Last Movements
    <hr />
    <div v-for="(state, idx) in game.movementHistory" :key="idx">
      <div v-for="(move, idx) in state" :key="idx">
        {{ move.origin.row }},{{ move.origin.col }}({{ move.origin.value }})
        <span v-if="move.isSpawn"> [spawned] </span>
        <span v-else>
          -> {{ move.target.row }},{{ move.target.col }}({{
            move.target.value
          }})
        </span>
        <span v-if="move.isMerge">[merge]</span>
      </div>
      <hr />
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