<template>
  <Story group="molecules"  auto-props-disabled :layout="{ type: 'grid', width: 300 }">
    <Settings :game="game" @update="handleUpdate" />
  </Story>
</template>

<script lang="ts" setup>
  import GameController from '@/model/2048 Standard/GameController'
  import { IGameSettings } from '@/model/Game Utils/SaveFile/interfaces/GameSettings'
  import { logEvent } from 'histoire/client'
  import Settings from './Settings.vue'
  const game = new GameController()

  function handleUpdate(settings: IGameSettings) {
    logEvent('update', settings)
  }
</script>
