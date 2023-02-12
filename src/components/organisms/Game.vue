<template>
  <div :class="`game ${game.gameOver ? 'game--over' : 'game--running'}`">
    <Transition name="fade">
      <div class="game__overlay" v-if="!game.isRunning && !game.endless">
        <div class="game__overlay--score">Score: {{ game.score }}</div>
        <div class="game__overlay--buttons">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            @click="$emit('newGame')"
            >{{ newGameText }}</v-btn
          >
          <v-btn
            v-if="allowEndless && game.winner"
            color="primary"
            variant="flat"
            size="large"
            @click="$emit('setEndless')"
            >{{ continueText }}</v-btn
          >
        </div>
      </div>
      <div class="game__overlay" v-else-if="game.paused && !disablePauseScreen">
        <span class="game__overlay--pause"> Game Paused </span>
      </div>
    </Transition>
    <div class="game__hud">
      <div class="game__hud--buttons">
        <v-btn
          v-if="allowRestart"
          size="small"
          variant="text"
          @click="$emit('restart')"
          >{{ restartText }}</v-btn
        >
        <v-btn
          v-if="allowUndo && game.historySize"
          size="small"
          variant="text"
          :disabled="game.history.length === 0"
          @click="undo"
        >
          <span v-if="game.history.length" class="mr-1"
            >({{ game.history.length }})</span
          >
          {{ undoText }}
        </v-btn>
      </div>
      <div class="game__hud--score">
        <TransitionGroup name="scroll-y-reverse">
          <v-chip
            v-if="game.isNewHighscore"
            class="game__hud--new-highscore"
            size="x-small"
            color="error"
            variant="flat"
          >
            New Best!
          </v-chip>
        </TransitionGroup>
        Score:
        <span class="points">
          {{ game.score }}
          <TransitionGroup name="scroll-y-reverse">
            <span
              v-for="idx in 3"
              :key="animatedPoints[idx]?.id ?? -idx"
              v-show="animatedPoints[idx]"
              class="game__animated-point"
              :id="animatedPoints[idx]?.id ?? -idx"
              :style="animatedPointsStyle"
            >
              {{ animatedPoints[idx]?.points }}
            </span>
          </TransitionGroup>
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

<script lang="ts">
  import GameController from '@/model/2048 Standard/GameController'
  import GameControls from '@/components/molecules/GameControls.vue'
  import Board from '@/components/molecules/Board.vue'
  import { computed, watch, ref } from 'vue'
  import { useGameCommands, BoardCommand } from '@/composables/boardCommands'
  import { remove } from 'lodash'
  import Square from '@/model/2048/Square'
import { SquareStateMeta } from '@/model/2048/interfaces/Square'

  export default {
    components: { Board, GameControls },
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
      pointAnimationDuration: {
        type: Number,
        default: 750,
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
    },
    emits: [
      'move',
      'idle',
      'win',
      'gameOver',
      'newGame',
      'restart',
      'setEndless',
      'squareSelected',
    ],
    setup(props, context) {
      const stateTracker: {
        moveCountdown: number
        idleTimeout?: NodeJS.Timeout
      } = {
        moveCountdown: props.emitMovesInterval,
        idleTimeout: undefined,
      }

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

      const trackMove = (dir: BoardCommand, success: boolean) => {
        if (!success) return
        stateTracker.moveCountdown--
        if (stateTracker.moveCountdown === 0) {
          context.emit('move', dir)
          stateTracker.moveCountdown = props.emitMovesInterval
        }
      }

      const animatedPoints = ref(new Array(3).fill(0))
      const animatedPointsStyle = computed(() => ({
        transition: `${
          props.pointAnimationDuration / 2
        }ms cubic-bezier(.15,.75,0,1)`,
      }))

      const animatePoints = (
        dir: BoardCommand,
        success: boolean,
        points: number
      ) => {
        if (!points) return
        const id = props.game.moves
        const point = {
          id,
          points: points < 0 ? points : '+' + points,
        }
        animatedPoints.value.push(point)
        if (animatedPoints.value.length > 3) animatedPoints.value.shift()
        else if (animatedPoints.value.length < 3)
          animatedPoints.value.unshift(0)
        setTimeout(() => {
          remove(animatedPoints.value, (p) => p.id === point.id)
          if (animatedPoints.value.length < 3) animatedPoints.value.unshift(0)
        }, props.pointAnimationDuration / 2)
      }

      const trackInvalidMove = (dir: BoardCommand, success: boolean) => {
        if (!success) {
          invalidMove.value = dir
          props.game.board.squares.forEach(sqr => {
            sqr.setMeta(SquareStateMeta.InvalidMove, true)
          });
          setTimeout(() => (invalidMove.value = ''), 200)
        } else invalidMove.value = ''
      }

      const moveCallbacks: ((
        dir: BoardCommand,
        success: boolean,
        points: number
      ) => void)[] = [trackInvalidMove]
      if (props.emitMovesInterval) moveCallbacks.push(trackMove)
      if (props.timeToIdle) moveCallbacks.push(resetIdle)
      if (props.pointAnimationDuration) moveCallbacks.push(animatePoints)

      const { move, undo } = useGameCommands(
        props.game,
        '#touchArea',
        moveCallbacks.length > 0
          ? (dir, success, pointsGained) => {
              moveCallbacks.forEach((fn) => fn(dir, success, pointsGained))
            }
          : undefined
      )

      const gameEnded = computed(() => props.game.winner || props.game.gameOver)

      watch(gameEnded, () => {
        if (gameEnded.value) {
          context.emit(props.game.winner ? 'win' : 'gameOver')
        }
      })

      const handleSquareSelected = (sqr: Square) => {
        if (props.allowSquareSelection) context.emit('squareSelected', sqr)
      }

      return {
        move,
        undo,
        boardClasses,
        animatedPoints,
        animatedPointsStyle,
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
    max-height: 80vh;

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
      border-radius: $border-radius * 0.5;
      justify-content: center;
      align-items: center;
      z-index: $hud-z-index;

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
        z-index: $hud-z-index - 1;
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

    &__controls {
      margin-top: $default-spacing * 0.5;
    }

    &__command-listener {
      display: none;
    }

    &__animated-point {
      display: none;
      position: absolute;
      font-size: 0.8em;
      right: 0;
      bottom: 90%;
      opacity: 0.75;
      font-weight: 500;

      @include screen-above(sm) {
        display: initial;
      }
    }

    @include screen-above(md) {
      &__hud {
        &--score {
          font-size: 1.2rem;
        }
      }
    }

    $bump-dislocation: 5px;
    $bump-rotation: 1deg;
    @include bumpAnimation(
      'bump-left',
      $x: -$bump-dislocation,
      $rotation: -$bump-rotation
    );
    @include bumpAnimation(
      'bump-right',
      $x: $bump-dislocation,
      $rotation: $bump-rotation
    );
    @include bumpAnimation('bump-up', $y: -$bump-dislocation, $rotation: 0);
    @include bumpAnimation('bump-down', $y: $bump-dislocation, $rotation: 0);
  }
</style>
