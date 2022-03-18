<template>
  <div :class="`game ${game.isGameOver ? 'game--over' : 'game--running'}`">
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
      <div class="game__board--touch-area" ref="touchArea"></div>
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
      />
      <Keypress
        :key="38"
        key-event="keydown"
        @success="keyboardCommand"
      />
      <Keypress
        :key="39"
        key-event="keydown"
        @success="keyboardCommand"
      />
      <Keypress
        :key="40"
        key-event="keydown"
        @success="keyboardCommand"
      />
    </div>
  </div>
</template>

<script>
import Game from "@/model/2048/GameController";
import Board from "@/components/molecule/Board.vue";
import Btn from "@/components/atoms/Btn.vue";
import Keypress from "vue-keypress";

const TOUCH_INFO = {
  start: null,
  minimumSwipeSize: 30, //px,
  releaseTouchTime: 1500, //ms
  releaseTimeOut: null
};

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
        cmd.event.preventDefault()
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
    handleTouchStart(evt) {
      evt.preventDefault();
      if (TOUCH_INFO.start) return;
      TOUCH_INFO.start = {
        id: evt.touches[0].identifier,
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY,
      };
      TOUCH_INFO.releaseTimeOut = setTimeout(() =>{
        TOUCH_INFO.start = null;
      }, TOUCH_INFO.releaseTouchTime)
    },
    handleTouchEnd(evt) {
      evt.preventDefault();
      if (!TOUCH_INFO.start) return;
      let touch;
      for (let i = 0; i < evt.changedTouches.length; i++) {
        if (evt.changedTouches[i].identifier === TOUCH_INFO.start.id) {
          touch = evt.changedTouches[i];
          break;
        }
      }
      if (!touch) return;

      const end = {
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
        },
        deltaX = Math.abs(TOUCH_INFO.start.x - end.x),
        deltaY = Math.abs(TOUCH_INFO.start.y - end.y);

      let command;
      if (deltaX > deltaY && deltaX > TOUCH_INFO.minimumSwipeSize) {
        if (TOUCH_INFO.start.x > end.x) command = "left";
        else command = "right";
      } else if (deltaY > TOUCH_INFO.minimumSwipeSize) {
        if (TOUCH_INFO.start.y > end.y) command = "top";
        else command = "bottom";
      }

      if (command) {
        this.swipeCommand(command);
      }

      if(TOUCH_INFO.releaseTimeOut){
        clearTimeout(TOUCH_INFO.releaseTimeOut);
        TOUCH_INFO.releaseTimeOut = null
      }
      TOUCH_INFO.start = null;
    },
  },
  mounted() {
    this.$refs.touchArea.addEventListener("touchstart", this.handleTouchStart);
    this.$refs.touchArea.addEventListener("touchend", this.handleTouchEnd);
  },
  beforeDestroy() {
    this.$refs.touchArea.removeEventListener(
      "touchstart",
      this.handleTouchStart
    );
    this.$refs.touchArea.removeEventListener("touchend", this.handleTouchEnd);
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

  &--over {
    .game {
      &__hud {
        opacity: 0;
      }

      &__board{
        &--touch-area{
          display: none;
        }
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
    border-radius: $square-border-radius/2;
    justify-content: center;
    align-items: center;
    z-index: 2;

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

  &__board{
    position: relative;
    &--touch-area{
      position: absolute;
      top: 0;
      left: -1rem;
      width: calc(100% + 2rem);
      height : 100%;
      z-index: 1;
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