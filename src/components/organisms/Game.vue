<template>
  <div class="game" v-touch:swipe="swipeCommand">
    <div class="game__overlay">
      <button class="game_control" @click="game.start()">New Game</button>
    </div>
    <div class="game__score">Score: {{ game.score }}</div>
    <Board
      :board="game.board"
      :size="game.size"
      :transition-duration="game.updateDelay"
    />
    <div class="game__controls">
      <button
        class="game_control"
        @click="game.move('left')"
        :disabled="game.isGameOver || !game.canMoveLeft"
      >
        left
      </button>
      <button
        class="game_control"
        @click="game.move('up')"
        :disabled="game.isGameOver || !game.canMoveUp"
      >
        up
      </button>
      <button
        class="game_control"
        @click="game.move('down')"
        :disabled="game.isGameOver || !game.canMoveDown"
      >
        down
      </button>
      <button
        class="game_control"
        @click="game.move('right')"
        :disabled="game.isGameOver || !game.canMoveRight"
      >
        right
      </button>
    </div>
    <div class="game__command-listener" v-if="!game.isGameOver">
      <Keypress
        :key="37"
        key-event="keydown"
        @success="keyboardCommand"
        prevent-default
      />
      <Keypress
        :key="38"
        key-event="keydown"
        @success="keyboardCommand"
        prevent-default
      />
      <Keypress
        :key="39"
        key-event="keydown"
        @success="keyboardCommand"
        prevent-default
      />
      <Keypress
        :key="40"
        key-event="keydown"
        @success="keyboardCommand"
        prevent-default
      />
    </div>
  </div>
</template>

<script>
import Game from "../../model/GameController";
import Board from "../molecule/Board.vue";
import Keypress from "vue-keypress";

const COMMAND_KEYS = {
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowLeft: "left",
  right: "right",
  left: "left",
  top: "up",
  bottom: "down",
};

const COOLDOWN = {
  active: false,
  timeout: null,
};

export default {
  components: { Board, Keypress },
  name: "Game",
  props: {
    game: {
      type: Game,
      required: true,
    },
  },
  methods: {
    keyboardCommand(cmd) {
      if (COOLDOWN.active || this.game.isGameOver) return;

      if (COMMAND_KEYS[cmd.event.key]) {
        COOLDOWN.active = true;

        this.game.move(COMMAND_KEYS[cmd.event.key]);
        this.startCooldown();
      }
    },
    swipeCommand(cmd) {
      if (COOLDOWN.active || this.game.isGameOver) return;

      this.game.move(COMMAND_KEYS[cmd]);
      this.startCooldown();
    },
    startCooldown() {
      if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout);
      COOLDOWN.timeout = setTimeout(() => {
        COOLDOWN.active = false;
      }, this.game.updateDelay);
    },
  },
};
</script>