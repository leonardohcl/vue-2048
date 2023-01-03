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
      <div class="game__board--touch-area" id="touchArea"></div>
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
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import Board from '@/components/molecules/Board.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import { useKeypress } from 'vue3-keypress'
  import { useSwipe } from '@/mixins/swipe'
  import { ref } from 'vue'

  const COMMAND_KEYS = {
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    right: 'right',
    left: 'left',
    top: 'up',
    bottom: 'down',
  }

  export default {
    components: { Board, Btn },
    name: 'Game',
    props: {
      game: {
        type: GameController,
        required: true,
      },
    },
    setup(props) {
      const COOLDOWN = {
        active: false,
        timeout: null,
      }

      const ignoreWin = ref(false)

      const canMove = () => {
        if (COOLDOWN.active) return false
        if (props.game.isGameOver) return false
        if (props.game.winner && !ignoreWin.value) return false
        return true
      }

      const startCooldown = () => {
        COOLDOWN.active = true
        if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout)
        COOLDOWN.timeout = setTimeout(() => {
          COOLDOWN.active = false
        }, props.game.updateDelay)
      }

      const keyboardCommand = (cmd) => {
        if (COMMAND_KEYS[cmd.event.key]) {
          if (!canMove()) return
          startCooldown()
          props.game.move(COMMAND_KEYS[cmd.event.key])
        }
      }

      useKeypress({
        keyEvent: 'keydown',
        keyBinds: [
          'up',
          'down',
          'right',
          'left',
          'ArrowUp',
          'ArrowDown',
          'ArrowRight',
          'ArrowLeft',
        ].map((key) => ({
          keyCode: key,
          preventDefault: true,
          success: keyboardCommand,
        })),
      })

      const swipeCommand = (cmd) => {
        if (!canMove()) return
        startCooldown()
        props.game.move(COMMAND_KEYS[cmd])
      }

      useSwipe('#touchArea', swipeCommand)

      return {
        ignoreWin,
        canMove,
        startCooldown,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .game {
    border-radius: $border-radius;
    border: solid 3px $bg-secondary;
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

        &__board {
          &--touch-area {
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
      border-radius: $border-radius/2;
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

      @include transition-animation(fade, 0.1s, ease);
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

    &__board {
      position: relative;
      &--touch-area {
        position: absolute;
        top: 0;
        left: -1rem;
        width: calc(100% + 2rem);
        height: 100%;
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
