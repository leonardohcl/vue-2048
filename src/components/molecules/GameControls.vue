<template>
  <div class="game-controls">
    <div class="game-controls--callout">Select your next movement:</div>
    <v-btn
      class="game-controls__button"
      v-bind="buttonParams"
      :disabled="!canMove('left')"
      @click="sendCommand('left')"
    >
      LEFT
    </v-btn>
    <v-btn
      class="game-controls__button"
      v-bind="buttonParams"
      :disabled="!canMove('up')"
      @click="sendCommand('up')"
    >
      UP
    </v-btn>
    <v-btn
      class="game-controls__button"
      v-bind="buttonParams"
      :disabled="!canMove('down')"
      @click="sendCommand('down')"
    >
      DOWN
    </v-btn>
    <v-btn
      class="game-controls__button"
      v-bind="buttonParams"
      :disabled="!canMove('right')"
      @click="sendCommand('right')"
    >
      RIGHT
    </v-btn>
    <div class="game-controls--callout">
      <small> *You can also use the arrow keys or swipe the board </small>
    </div>
  </div>
</template>

<script>
import GameController from "@/model/2048/GameController";
import { computed } from "@vue/reactivity";

export default {
  emits: ["command"],
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
      context.emit("command", dir);
    };

    const buttonParams = computed(() => ({
      variant: "flat",
      size: "small",
      ...props.buttonOptions,
    }));

    const canMove = (dir) => {
      if (props.game.paused) return false;
      if (props.game.gameOver) return false;
      return dir ? props.game.canMove[dir] : true;
    };

    return { buttonParams, sendCommand, canMove };
  },
};
</script>

<style lang="scss">
.game-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.5rem;

  &--callout {
    font-weight: 300;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
