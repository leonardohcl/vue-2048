<template>
  <div
    :class="`game ${game.isGameOver ? 'game--over' : 'game--running'}`"
    v-touch:swipe="swipeCommand"
  >
    <Transition name="fade">
      <div
        class="game__overlay"
        v-if="game.isGameOver || (game.winner && !ignoreWin)"
      >
        <div class="game__overlay--score">Score: {{ game.score }}</div>
        <div class="game__overlay--buttons">
          <Btn @click="game.start()">New Game</Btn>
          <Btn @click="ignoreWin = true" v-if="game.winner && !ignoreWin"
            >Continue</Btn
          >
        </div>
      </div>
    </Transition>
    <div class="game__hud">
      <div class="game__hud--score">
        Score:
        <span class="points">
          {{ game.score }}
        </span>
      </div>
      <div class="game__hud--buttons">
        <Btn @click="game.start()" size="sm" outlined>Restart</Btn>
      </div>
    </div>
    <div class="game__board">
      <Board
        :board="game.board"
        :size="game.size"
        :transition-duration="game.updateDelay"
      />
    </div>
    <div class="game__controls">
      <div class="game__controls--callout">Select your next movement:</div>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('left')"
        :disabled="game.isGameOver || !game.canMoveLeft"
      >
        LEFT
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('up')"
        :disabled="game.isGameOver || !game.canMoveUp"
      >
        UP
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('down')"
        :disabled="game.isGameOver || !game.canMoveDown"
      >
        DOWN
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('right')"
        :disabled="game.isGameOver || !game.canMoveRight"
      >
        RIGHT
      </Btn>
      <div class="game__controls--callout">
        <small> *You can also use the arrow keys or swipe the board </small>
      </div>
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
import Game from "@/model/GameController";
import Board from "@/components/molecule/Board.vue";
import Btn from "@/components/atoms/Btn.vue";
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
  components: { Board, Keypress, Btn },
  name: "Game",
  props: {
    game: {
      type: Game,
      required: true,
    },
  },
  data() {
    return {
      ignoreWin: false,
    };
  },
  methods: {
    keyboardCommand(cmd) {
      if (COMMAND_KEYS[cmd.event.key]) {
        if (!this.canMove()) return;
        this.startCooldown();
        this.game.move(COMMAND_KEYS[cmd.event.key]);
      }
    },
    swipeCommand(cmd) {
      if (!this.canMove()) return;
      this.startCooldown();
      this.game.move(COMMAND_KEYS[cmd]);
    },
    startCooldown() {
      COOLDOWN.active = true;
      if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout);
      COOLDOWN.timeout = setTimeout(() => {
        COOLDOWN.active = false;
      }, this.game.updateDelay);
    },
    canMove() {
      if (COOLDOWN.active) return false;
      if (this.game.isGameOver) return false;
      if (this.game.winner && !this.ignoreWin) return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/base";

.game {
  border-radius: $square-border-radius;
  border: solid 3px $bg-surface;
  padding: 1rem;
  position: relative;
  width: 100%;
  min-width: 200px;
  max-width: 400px;
  touch-action: pan-x;

  &--over {
    .game {
      &__hud {
        opacity: 0;
      }
    }
  }

  &__overlay {
    background-color: fade-out($square-color, 0.75);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    border-radius: $square-border-radius;
    justify-content: center;
    align-items: center;
    z-index: 1;

    &--score {
      color: black;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    &--buttons {
      display: flex;
      justify-content: center;

      & > *:not(:last-child) {
        margin-right: 0.5rem;
      }
    }

    @include fade-animation(0.1s, ease);
  }

  &__hud {
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &--score {
      font-size: 1rem;
      font-weight: 300;
      .points {
        font-size: 1.3em;
        font-weight: bold;
      }
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &--callout {
      font-weight: 300;
      width: 100%;
      margin: 0.5rem 0;
    }

    .game__control:not(:last-child) {
      margin-right: 0.5rem;
    }
  }

  &__command-listener {
    display: none;
  }
}

@include screen-above(md) {
  .game {
    &__hud {
      &--score {
        font-size: 1.2rem;
      }
    }
  }
}
</style>