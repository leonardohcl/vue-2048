<template>
  <div :class="`game ${game.gameOver ? 'game--over' : 'game--running'}`">
    <Transition name="fade">
      <div
        class="game__overlay"
        v-if="game.gameOver || (game.winner && !ignoreWin)"
      >
        <div class="game__overlay--score">Score: {{ game.score }}</div>
        <div class="game__overlay--buttons">
          <Btn @click="game.start()">New Game</Btn>
          <Btn @click="ignoreWin = true" v-if="game.winner && !ignoreWin"
            >Continue</Btn
          >
        </div>
      </div>
      <div class="game__overlay" v-else-if="game.paused">
        <span class="game__overlay--pause"> Game Paused </span>
      </div>
    </Transition>
    <div class="game__hud">
      <div class="game__hud--buttons">
        <Btn @click="game.start()" size="sm" outlined>Restart</Btn>
        <Btn
          v-if="game.historySize"
          size="sm"
          outlined
          :disabled="game.history.length === 0"
          @click="game.undo()"
        >
          <span v-if="game.history.length">({{ game.history.length }})</span>
          Undo
        </Btn>
      </div>
      <div class="game__hud--score">
        <p class="new-highscore" v-if="newHighscore">
          <FontAwesomeIcon icon="trophy" /> New Best!
        </p>
        Score:
        <span class="points">
          {{ game.score }}
        </span>
      </div>
    </div>
    <div class="game__board">
      <div class="game__board--touch-area" id="touchArea"></div>
      <Board :board="game.board" :transition-duration="game.updateDelay" />
    </div>
    <div class="game__controls">
      <div class="game__controls--callout">Select your next movement:</div>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('left')"
        :disabled="game.gameOver || !game.canMove.left"
      >
        LEFT
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('up')"
        :disabled="game.gameOver || !game.canMove.up"
      >
        UP
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('down')"
        :disabled="game.gameOver || !game.canMove.down"
      >
        DOWN
      </Btn>
      <Btn
        class="game__control"
        size="sm"
        @click="game.move('right')"
        :disabled="game.gameOver || !game.canMove.right"
      >
        RIGHT
      </Btn>
      <div class="game__controls--callout">
        <small> *You can also use the arrow keys or swipe the board </small>
      </div>
    </div>

    <SaveScoreModal :game="game" :id="`${id}-new-highscore`" />
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import SaveScoreModal from '@/components/molecules/SaveScoreModal.vue'
  import Board from '@/components/molecules/Board.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import { useKeypress } from 'vue3-keypress'
  import { useSwipe } from '@/mixins/swipe'
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'

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
    components: { Board, SaveScoreModal, Btn },
    name: 'Game',
    props: {
      game: {
        type: GameController,
        required: true,
      },
      id: {
        type: String,
        default: 'main-game',
      },
    },
    watch: {
      shouldSaveScore(shouldSave) {
        if (shouldSave) this.$bvModal.show(`${this.id}-new-highscore`)
      },
    },
    computed: {
      shouldSaveScore() {
        const gameEnded =
          (this.game.winner && !this.ignoreWin) || this.game.gameOver
        const scoreIsQualified =
          this.game.score > this.rankingBoundaries.last ||
          this.rankingBoundaries.count < 10
        return gameEnded && scoreIsQualified
      },
    },
    setup(props) {
      const COOLDOWN = {
        active: false,
        timeout: null,
      }

      const store = useStore()

      const ignoreWin = ref(false)

      const canMove = () => {
        if (COOLDOWN.active) return false
        if (props.game.gameOver) return false
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
        if (props.game.paused) return
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
        if (props.game.paused || !canMove()) return
        startCooldown()
        props.game.move(COMMAND_KEYS[cmd])
      }

      useSwipe('#touchArea', swipeCommand)      

      const availableRankings = computed(() => store.getters.availableRankings)

      const rankingBoundaries = computed(() => {
        const ranking = availableRankings.value.find(
          (list) => list.name === `${props.game.width}x${props.game.height}`
        )
        if (ranking)
          return {
            first: ranking.scores[0].score,
            last: ranking.scores[ranking.scores.length - 1].score,
            count: ranking.scores.length,
          }

        return {
          first: 0,
          last: 0,
          count: 0,
        }
      })

      const newHighscore = computed(
        () =>
          rankingBoundaries.value.count > 0 &&
          props.game.score > rankingBoundaries.value.first
      )

      return {
        ignoreWin,
        rankingBoundaries,
        newHighscore,
        canMove,
        startCooldown,
      }
    },
  }
</script>

<style lang="scss" scoped>
  $container-border-size: 3px;
  $container-padding: 1rem;
  .game {
    border-radius: $border-radius;
    border: solid $container-border-size $bg-secondary;
    padding: $container-padding;
    position: relative;
    width: 100%;
    min-width: 200px;
    max-width: 400px;

    &--over {
      .game {
        &__hud {
          & > * {
            opacity: 0;
          }
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

      &--score,
      &--pause {
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
      flex-wrap: wrap;

      &--score {
        position: relative;
        font-size: 1rem;
        font-weight: 300;
        .points {
          font-size: 1.3em;
          font-weight: bold;
        }

        .new-highscore {
          background-color: $danger;
          border-radius: $border-radius;
          text-align: center;
          font-size: 0.5em;
          font-weight: bold;
          position: absolute;
          width: 100%;
          top: -1em;
          max-width: 80px;
          margin: 0;
          right: 0;
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
