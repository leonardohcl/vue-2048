<template>
  <Story group="molecules" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Standard">
      <MemoryCard
        :memory-card="(standardMemoryCard as MemoryCardClass<SaveFile>)"
        :mode="state.mode"
        @select="handleSelect"
      />
    </Variant>
    <Variant title="Roguelike">
      <MemoryCard
        :mode="state.mode"
        :memory-card="(roguelikeMemoryCard as MemoryCardClass<RoguelikeSaveFile>)"
        @select="handleSelect"
      />
    </Variant>
    <template #controls>
      <HstButtonGroup
        title="Mode"
        :options="[MemoryCardMode.Load, MemoryCardMode.Save]"
        v-model="state.mode"
      />
    </template>
  </Story>
</template>

<script setup lang="ts">
  import MemoryCard from './MemoryCard.vue'
  import MemoryCardClass, {
    MemoryCardMode,
    SlotName,
  } from '@/model/Game Utils/MemoryCard'
  import { reactive } from 'vue'
  import GameMode from '@/model/Game Utils/GameMode'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import GameController from '@/model/2048 Standard/GameController'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import { logEvent } from 'histoire/client'

  const state = reactive({
    mode: MemoryCardMode.Load,
  })

  const roguelikeMemoryCard = reactive(
    new MemoryCardClass<RoguelikeSaveFile>(GameMode.Roguelike)
  )
  const standardMemoryCard = reactive(
    new MemoryCardClass<SaveFile>(GameMode.Standard)
  )

  standardMemoryCard.save(new GameController().getSaveFile(), SlotName.Slot1)
  roguelikeMemoryCard.save(
    new RoguelikeGameController().getSaveFile(),
    SlotName.Slot1
  )

  function handleSelect(slot: SlotName) {
    logEvent('select', { emitted: slot })
  }
</script>
