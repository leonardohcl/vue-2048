<template>
  <div class="game-controls">
    <div class="game-controls__buttons">
      <div class="game-controls__button--container game-controls__button--left">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove('left')"
          @click="sendCommand('left')"
        >
          LEFT
        </v-btn>
      </div>

      <div class="game-controls__button--container game-controls__button--up">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove('up')"
          @click="sendCommand('up')"
        >
          UP
        </v-btn>
      </div>

      <div class="game-controls__button--container game-controls__button--right">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove('right')"
          @click="sendCommand('right')"
        >
          RIGHT
        </v-btn>
      </div>

      <div class="game-controls__button--container game-controls__button--down">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove('down')"
          @click="sendCommand('down')"
        >
          DOWN
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import GameController from '@/model/2048 Standard/GameController'
  import { computed } from '@vue/reactivity'

  export default {
    emits: ['command'],
    props: {
      game: {
        type: GameController,
        required: true,
      },
      buttonOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props, context) {
      const sendCommand = (dir) => {
        context.emit('command', dir)
      }

      const buttonParams = computed(() => ({
        variant: 'flat',
        size: 'small',
        ...props.buttonOptions,
      }))

      const canMove = (dir) => {
        if (props.game._paused) return false
        if (props.game._gameOver) return false
        return dir ? props.game._canMove[dir] : true
      }

      return { buttonParams, sendCommand, canMove }
    },
  }
</script>

<style lang="scss">
  .game-controls {
    &__buttons {
      display: grid;
      justify-content: center;
      grid-template-columns: repeat(3, fit-content);
      gap: 0.5rem;
      font-size: 0.8rem;
    }

    &__button {
      &--left,
      &--right {
        grid-row: 1/3;
      }

      &--right{
        grid-column-start: 3;
        justify-self: flex-start;
      }

      &--container{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
