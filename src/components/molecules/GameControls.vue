<template>
  <div class="game-controls">
    <div class="game-controls--callout">Select your next movement:</div>
    <Btn
      class="game-controls__button"
      size="sm"
      @click="sendCommand('left')"
      :disabled="!canMove('left')"
    >
      LEFT
    </Btn>
    <Btn
      class="game-controls__button"
      size="sm"
      @click="sendCommand('up')"
      :disabled="!canMove('up')"
    >
      UP
    </Btn>
    <Btn
      class="game-controls__button"
      size="sm"
      @click="sendCommand('down')"
      :disabled="!canMove('down')"
    >
      DOWN
    </Btn>
    <Btn
      class="game-controls__button"
      size="sm"
      @click="sendCommand('right')"
      :disabled="!canMove('right')"
    >
      RIGHT
    </Btn>
    <div class="game-controls--callout">
      <small> *You can also use the arrow keys or swipe the board </small>
    </div>
  </div>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import GameController from '@/model/2048/GameController'

  export default {
    components: { Btn },
    emits: ['command'],
    props: {
      game: {
        type: GameController,
        required: true,
      },
    },
    setup(props, context) {
      const sendCommand = (dir) => {
        context.emit('command', dir)
      }

      const canMove = (dir) => {
        if (props.game.paused) return false
        if (props.game.gameOver) return false
        return dir ? props.game.canMove[dir] : true
      }

      return { sendCommand, canMove }
    },
  }
</script>

<style lang="scss" scoped>
  .game-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &--callout {
      font-weight: 300;
      width: 100%;
      margin: 0.5rem 0;
    }

    &__button {
      &:not(:last-child) {
        margin-right: 0.5rem;
      }
    }
  }
</style>
