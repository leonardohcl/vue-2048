<template>
  <div class="game-controls">
    <div class="game-controls__buttons">
      <div class="game-controls__button--container game-controls__button--left">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove(MoveDirection.Left)"
          @click="sendCommand(MoveDirection.Left)"
        >
          LEFT
        </v-btn>
      </div>

      <div class="game-controls__button--container game-controls__button--up">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove(MoveDirection.Up)"
          @click="sendCommand(MoveDirection.Up)"
        >
          UP
        </v-btn>
      </div>

      <div
        class="game-controls__button--container game-controls__button--right"
      >
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove(MoveDirection.Right)"
          @click="sendCommand(MoveDirection.Right)"
        >
          RIGHT
        </v-btn>
      </div>

      <div class="game-controls__button--container game-controls__button--down">
        <v-btn
          class="game-controls__button"
          v-bind="buttonParams"
          :disabled="!canMove(MoveDirection.Down)"
          @click="sendCommand(MoveDirection.Down)"
        >
          DOWN
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    GameActionTracker,
    MoveDirection,
  } from '@/model/2048/interfaces/Game'
  import LooseObject from '@/utils/LooseObject'
  import { computed } from 'vue'

  const emit = defineEmits(['command'])
  const props = defineProps({
    actionTracker: { type: GameActionTracker, required: true },
    allowCommands: { type: Boolean, default: true },
    buttonOptions: { type: Object, default: () => ({}) },
  })

  const sendCommand = (dir: MoveDirection) => {
    emit('command', dir)
  }

  const buttonParams = computed<LooseObject>(() => ({
    variant: 'flat',
    size: 'small',
    ...props.buttonOptions,
  }))

  const canMove = (dir: MoveDirection) => {
    if (!props.allowCommands) return false
    return dir ? props.actionTracker[dir] : true
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

      &--right {
        grid-column-start: 3;
        justify-self: flex-start;
      }

      &--container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
