<template>
  <div :class="`game ${game.gameOver ? 'game--over' : 'game--running'}`">
    <Transition name="fade">
      <div class="game__overlay" v-if="game.gameOver || game.winner">
        <div class="game__overlay--score">Score: {{ game.score }}</div>
        <div class="game__overlay--buttons">
          <Btn @click="$emit('newGame')">{{ newGameText }}</Btn>
          <Btn
            @click="$emit('setEndless')"
            v-if="allowEndless && game.winner"
            >{{ continueText }}</Btn
          >
        </div>
      </div>
      <div class="game__overlay" v-else-if="game.paused && !disablePauseScreen">
        <span class="game__overlay--pause"> Game Paused </span>
      </div>
    </Transition>
    <div class="game__hud">
      <div class="game__hud--buttons">
        <Btn @click="$emit('restart')" size="sm" outlined v-if="allowRestart">{{
          restartText
        }}</Btn>
        <Btn
          v-if="allowUndo && game.historySize"
          size="sm"
          outlined
          :disabled="game.history.length === 0"
          @click="undo"
        >
          <span v-if="game.history.length">({{ game.history.length }})</span>
          {{ undoText }}
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
    <div class="game__board" :class="boardClasses">
      <div
        class="game__board--touch-area"
        id="touchArea"
        v-show="!allowSquareSelection"
      />
      <Board
        :board="game.board"
        :transition-duration="game.updateDelay"
        @square-selected="handleSquareSelected"
      />
    </div>
    <GameControls class="game__controls" :game="game" @command="move" />
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import GameControls from '@/components/molecules/GameControls.vue'
  import Board from '@/components/molecules/Board.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import { computed, watch, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useGameCommands } from '@/mixins/gameCommands'

  export default {
    components: { Board, Btn, GameControls },
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
      emitMovesInterval: {
        type: Number,
        default: 0,
      },
      timeToIdle: {
        type: Number,
        default: 0,
      },
      allowEndless: {
        type: Boolean,
        default: true,
      },
      allowRestart: {
        type: Boolean,
        default: true,
      },
      allowUndo: {
        type: Boolean,
        default: true,
      },
      allowSquareSelection: {
        type: Boolean,
        default: false,
      },
      disablePauseScreen: { type: Boolean, default: false },
      undoText: { type: String, default: 'Undo' },
      restartText: { type: String, default: 'Restart' },
      newGameText: { type: String, default: 'New Game' },
      continueText: { type: String, default: 'Continue' },
      rankingId: { type: String, required: true },
    },
    emits: [
      'move',
      'idle',
      'win',
      'gameOver',
      'newGame',
      'restart',
      'setEndless',
    ],
    setup(props, context) {
      const stateTracker = {
        moveCountdown: props.emitMovesInterval,
        idleTimeout: null,
      }

      const store = useStore()

      const ranking = computed(() => store.getters.ranking(props.rankingId))

      const highScores = computed(() => {
        if (ranking.value.length > 0)
          return {
            first: ranking.value[0].score,
            last: ranking.value[ranking.value.length - 1].score,
            count: ranking.value.length,
          }

        return {
          first: 0,
          last: 0,
          count: 0,
        }
      })

      const newHighscore = computed(
        () =>
          highScores.value.count > 0 &&
          props.game.score > highScores.value.first
      )

      const invalidMove = ref('')
      const boardClasses = computed(() => ({
        [`game__board--invalid-move`]: !!invalidMove.value,
        [`game__board--invalid-move-right`]: invalidMove.value === 'right',
        [`game__board--invalid-move-left`]: invalidMove.value === 'left',
        [`game__board--invalid-move-up`]: invalidMove.value === 'up',
        [`game__board--invalid-move-down`]: invalidMove.value === 'down',
      }))

      const resetIdle = () => {
        if (stateTracker.idleTimeout) clearTimeout(stateTracker.idleTimeout)
        stateTracker.idleTimeout = setTimeout(() => {
          context.emit('idle')
        }, props.timeToIdle)
      }

      const trackMove = (dir, success) => {
        if (!success) return
        stateTracker.moveCountdown--
        if (stateTracker.moveCountdown === 0) {
          context.emit('move', dir)
          stateTracker.moveCountdown = props.emitMovesInterval
        }
      }

      const trackInvalidMove = (dir, success) => {
        if (!success) {
          invalidMove.value = dir
          setTimeout(() => (invalidMove.value = ''), 200)
        } else invalidMove.value = ''
      }

      const moveCallbacks = [trackInvalidMove]
      if (props.emitMovesInterval) moveCallbacks.push(trackMove)
      if (props.timeToIdle) moveCallbacks.push(resetIdle)

      const { move, undo } = useGameCommands(
        props.game,
        '#touchArea',
        moveCallbacks.length > 0
          ? (dir, success) => {
              moveCallbacks.forEach((fn) => fn(dir, success))
            }
          : null
      )

      const gameEnded = computed(() => props.game.winner || props.game.gameOver)

      watch(gameEnded, () => {
        if (gameEnded.value) {
          context.emit(props.game.winner ? 'win' : 'gameOver')
        }
      })

      const handleSquareSelected = (sqr) => {
        if (props.allowSquareSelection) context.emit('square-selected', sqr)
      }

      return {
        move,
        undo,
        highScores,
        newHighscore,
        boardClasses,
        handleSquareSelected,
      }
    },
  }
</script>

<style lang="scss">
  $container-border-size: 3px;
  $container-padding: $default-spacing * 0.5;
  .game {
    border-radius: $border-radius;
    border: solid $container-border-size $bg-secondary;
    padding: $container-padding;
    position: relative;
    width: 100%;
    min-width: 200px;
    max-width: map-get($grid-breakpoints, 'sm') * 0.75;

    &--over {
      .game {
        &__hud {
          & > * {
            opacity: 0.5;
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

      &--invalid-move {
        .square__block {
          opacity: 1;
          animation-duration: 200ms;
          animation-timing-function: ease-in-out;
        }

        &-left {
          .square__block {
            transform-origin: bottom left;
            animation-name: bump-left;
          }
        }
        &-right {
          .square__block {
            transform-origin: bottom right;
            animation-name: bump-right;
          }
        }
        &-up {
          .square__block {
            transform-origin: top center;
            animation-name: bump-up;
          }
        }
        &-down {
          .square__block {
            transform-origin: bottom center;
            animation-name: bump-down;
          }
        }
      }
    }

    &__command-listener {
      display: none;
    }

    @include screen-above(md) {
      max-width: map-get($grid-breakpoints, 'md') * 0.75;
      &__hud {
        &--score {
          font-size: 1.2rem;
        }
      }
    }

    @include screen-above(lg) {
      max-width: map-get($grid-breakpoints, 'lg') * 0.4;
    }

    $bump-dislocation: 5px;
    $bump-rotation: 1deg;
    @include bumpAnimation('bump-left', $x: -$bump-dislocation, $rotation: -$bump-rotation);
    @include bumpAnimation('bump-right', $x: $bump-dislocation, $rotation: $bump-rotation);
    @include bumpAnimation('bump-up', $y: -$bump-dislocation, $rotation: 0);
    @include bumpAnimation('bump-down', $y: $bump-dislocation, $rotation: 0);
  }
</style>
