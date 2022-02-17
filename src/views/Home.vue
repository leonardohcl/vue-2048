<template>
  <div>
    Score: {{ game.score }} <span v-if="game.isOver">GameOver</span>
    <div
      style="display: flex; flex-wrap: wrap"
      :style="{ width: `${game.size * 22}px` }"
    >
      <div
        v-for="(square, idx) in game.board"
        :key="idx"
        style="border: solid 1px; height: 20px; width: 20px; text-align: center"
      >
        {{ square.value || '' }}
      </div>
    </div>
    <div>
      <button
        @click="game.move('left')"
        :disabled="game.isOver || !game.canMoveLeft"
      >
        left
      </button>
      <button
        @click="game.move('up')"
        :disabled="game.isOver || !game.canMoveUp"
      >
        up
      </button>
      <button
        @click="game.move('down')"
        :disabled="game.isOver || !game.canMoveDown"
      >
        down
      </button>
      <button
        @click="game.move('right')"
        :disabled="game.isOver || !game.canMoveRight"
      >
        right
      </button>
    </div>
    <button @click="game.start()">New Game</button>
  </div>
</template>

<script>
  import Game from '../model/Game'

  export default {
    name: 'Home',
    data() {
      return {
        game: new Game(),
      }
    },
    methods: {
      board() {
        return this.game.board
      },
    },
    components: {},
  }
</script>
