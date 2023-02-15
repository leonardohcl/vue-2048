<template>
  <Story group="atoms" :layout="{ type: 'grid', width: '400px' }">
    <Variant title="Empty">
      <SaveSlot
        :slot-name="state.slotName"
        :mode="state.mode"
        @select="handleSelect"
        is-empty
      />
    </Variant>
    <Variant title="Standard">
      <SaveSlot
        :score="state.score"
        :block="state.block"
        :board-width="state.width"
        :board-height="state.height"
        :slot-name="state.slotName"
        :theme="state.theme"
        @select="handleSelect"
        />
      </Variant>
      <Variant title="Roguelike">
        <SaveSlot
        :slot-name="state.slotName"
        :score="state.score"
        :block="state.block"
        :board-width="state.width"
        :board-height="state.height"
        :run="state.run"
        :coins="state.coins"
        :theme="state.theme"
        @select="handleSelect"
        is-roguelike
      />
    </Variant>
    <template #controls>
      <HstText title="Slot name" v-model="state.slotName" />
      <HstButtonGroup
        title="Theme"
        v-model="state.theme"
        :options="['primary', 'secondary']"
      />
      <HstNumber title="Score" v-model="state.score" />
      <HstNumber title="Block" v-model="state.block" />
      <HstNumber title="Run" v-model="state.run" />
      <HstNumber title="Coins" v-model="state.coins" />
      <HstNumber title="Width" max="8" min="3" v-model="state.width" />
      <HstNumber title="Height" max="8" min="3" v-model="state.height" />
    </template>
  </Story>
</template>

<script lang="ts" setup>
  import { logEvent } from 'histoire/client'
  import SaveSlot from './SaveSlot.vue'
  import { reactive } from 'vue'
  import { MemoryCardMode } from '@/model/Game Utils/MemoryCard'

  const state = reactive({
    slotName: 'slotname',
    theme: 'primary',
    run: 0,
    score: 0,
    coins: 0,
    width: 4,
    height: 4,
    block: 2048,
    mode: MemoryCardMode.Load,
  })

  function handleSelect(slot: string) {
    logEvent('select', { emmited: slot })
  }
</script>
