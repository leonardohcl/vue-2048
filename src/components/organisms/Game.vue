<template>
  <div :class="`game ${game.gameOver ? 'game--over' : 'game--running'}`">
    <Transition name="fade">
      <div class="game__overlay" v-if="game.gameOver || game.winner">
        <div class="game__overlay--score">Score: {{ game.score }}</div>
        <div class="game__overlay--buttons">
          <Btn @click="$emit('newGame')">New Game</Btn>
          <Btn @click="$emit('setEndless')" v-if="allowEndless && game.winner">Continue</Btn>
        </div>
      </div>
      <div class="game__overlay" v-else-if="game.paused">
        <span class="game__overlay--pause"> Game Paused </span>
      </div>
    </Transition>
    <div class="game__hud">
      <div class="game__hud--buttons">
        <Btn @click="$emit('newGame')" size="sm" outlined>Restart</Btn>
        <Btn
          v-if="game.historySize"
          size="sm"
          outlined
          :disabled="game.history.length === 0"
          @click="undo"
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
    <GameControls class="game__controls" :game="game" @command="move" />
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import GameControls from '@/components/molecules/GameControls.vue'
  import Board from '@/components/molecules/Board.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import { computed, watch } from 'vue'
  import { useHighScore } from '@/mixins/ranking'
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
      emitMoves: {
        type: Boolean,
        default: false,
      },
      allowEndless: {
        type:Boolean,
        default: true
      }
    },
    emits: ['move', 'win', 'gameOver', 'newHighScore', 'newGame', 'setEndless'],
    setup(props, context) {
      const highScores = useHighScore(props.game)

      const newHighscore = computed(
        () =>
          highScores.value.count > 0 &&
          props.game.score > highScores.value.first
      )

      const { move, undo } = useGameCommands(props.game, '#touchArea', (dir) =>
        context.emit('move', dir)
      )

      const gameEnded = computed(() => props.game.winner || props.game.gameOver)

      watch(gameEnded, () => {
        if (gameEnded.value) {
          context.emit(props.game.winner ? 'win' : 'gameOver')

          const shouldSaveScore =
            highScores.value.count < 10 ||
            props.game.score > highScores.value.last
            
          if (shouldSaveScore) context.emit('newHighScore')
        }
      })

      return {
        move,
        undo,
        highScores,
        newHighscore,
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
