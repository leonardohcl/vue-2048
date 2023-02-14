<template>
  <Story
    group="molecules"
    auto-props-disabled
    :layout="{ type: 'grid', width: 400 }"
  >
    <GameControls
      :allow-commands="allowCommands"
      :action-tracker="actionTracker"
      :button-options="buttonOptions"
      @command="handleCommand"
    />
    <template #controls>
      <HstCheckbox title="Allow Commands" v-model="allowCommands" />
      <HstCheckbox
        title="Can move up"
        v-model="actionTracker[MoveDirection.Up]"
      />
      <HstCheckbox
        title="Can move right"
        v-model="actionTracker[MoveDirection.Right]"
      />
      <HstCheckbox
        title="Can move down"
        v-model="actionTracker[MoveDirection.Down]"
      />
      <HstCheckbox
        title="Can move left"
        v-model="actionTracker[MoveDirection.Left]"
      />
    </template>
  </Story>
</template>

<script setup lang="ts">
  import {
    GameActionTracker,
    MoveDirection,
  } from '@/model/2048/interfaces/Game'
  import { logEvent } from 'histoire/client'

  import { reactive, ref } from 'vue'
  import GameControls from './GameControls.vue'
  const actionTracker = reactive(new GameActionTracker())
  const allowCommands = ref(true)
  const buttonOptions = ref({})

  function handleCommand(command: MoveDirection) {
    logEvent('command', { emitted: command })
  }
</script>
