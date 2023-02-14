<template>
  <Story auto-props-disabled group="molecules">
    <Board
      :board="board"
      :transition-duration="config.transitionDuration"
      :gap="config.gap"
      :inline="config.inline"
      @square-selected="handleSquareSelected"
    />
    <template #controls>
      <HstNumber
        title="Transition duration"
        v-model="config.transitionDuration"
      />
      <HstNumber title="Gap size" v-model="config.gap" />
      <HstNumber title="Width" v-model="config.width" />
      <HstNumber title="Height" v-model="config.height" />
      <HstCheckbox title="Inline" v-model="config.inline" />
    </template>
  </Story>
</template>

<script setup lang="ts">
  import Board from './Board.vue'
  import BoardClass from '@/model/2048/Board'

  import { reactive, computed } from 'vue'
  import { logEvent } from 'histoire/client'
  const config = reactive({
    width: 4,
    height: 4,
    transitionDuration: 0,
    gap: 4,
    squares: new Array(16).fill(0),
    inline: false,
  })

  const board = computed(() => new BoardClass(config.width, config.height))

  function handleSquareSelected(data: any) {
    logEvent('squareSelected', { emitted: data })
  }
</script>
