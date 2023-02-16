<template>
  <Story group="molecules" :layout="{ type: 'grid', width: 400 }">
    <div class="pa-5">
      <GameHud
        @restart="handleEvent('restart')"
        @undo="handleEvent('undo')"
        @mounted="setupHud"
      />
    </div>
    <template #controls>
      <div class="htw-p-2">
        <HstButton class="htw-p-2" @click="addPoints">Add points</HstButton>
      </div>
    </template>
  </Story>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { logEvent } from 'histoire/client'
  import GameHud from './GameHud.vue'
  import { BoardCommand } from '@/composables/boardCommands'
  import { MoveDirection } from '@/model/2048/interfaces/Game'

  const hud = reactive({
    animatePoints: (dir: BoardCommand, success: boolean, points: number) => {},
  })

  function handleEvent(name: string) {
    logEvent(name, {})
  }

  function setupHud(el: {
    animatePoints: (dir: BoardCommand, success: boolean, points: number) => void
  }) {
    hud.animatePoints = el.animatePoints
  }

  function addPoints() {
    const value = Math.round(Math.random() * 256)
    hud.animatePoints(MoveDirection.Up, true, value)
  }
</script>
