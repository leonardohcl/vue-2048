<template>
  <v-card
    title="Memory Card"
    :subtitle="`[${mode.toUpperCase()} GAME]`"
    prepend-icon="fas fa-fw fa-sd-card"
  >
    <v-card-text>
      <ul class="save-modal__list">
        <SaveSlot
          v-for="name in slotList"
          :key="name"
          :slot-name="name"
          :score="getScore(slots[name])"
          :board-width="slots[name] && slots[name].state.board.width"
          :board-height="slots[name] && slots[name].state.board.height"
          :block="getBlock(slots[name])"
          :run="getRun(slots[name])"
          :cois="getCoins(slots[name])"
          :is-roguelike="slots[name] instanceof RoguelikeSaveFile"
          :is-empty="slots[name] ? false : true"
          @select="handleSelect"
        />
      </ul>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import SaveSlot from '@/components/atoms/SaveSlot/SaveSlot.vue'
  import { computed } from 'vue'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import MemoryCard, {
    MemoryCardMode,
    SlotName,
    SLOTS_AVAILABLE,
  } from '@/model/Game Utils/MemoryCard'
  import LooseObject from '@/utils/LooseObject'

  const props = defineProps({
    mode: { default: MemoryCardMode.Load },
    memoryCard: { type: MemoryCard, required: true },
  })

  const emit = defineEmits(['select'])

  const slotList = computed(() =>
    SLOTS_AVAILABLE.filter((x) => x !== SlotName.LastGame)
  )

  const slots = computed(
    () => props.memoryCard.slots as LooseObject<SaveFile | RoguelikeSaveFile>
  )

  function handleSelect(slotName: SlotName) {
    if (props.mode === MemoryCardMode.Load && !slots.value[slotName]) return
    emit('select', slotName)
  }

  function getScore(slot?: RoguelikeSaveFile | SaveFile) {
    if(!slot) return 0
    if (slot instanceof RoguelikeSaveFile)
    return (slot as RoguelikeSaveFile).bestRun.score
    return slot.progress.score
  }
  function getBlock(slot?: RoguelikeSaveFile | SaveFile) {
    if(!slot) return 0
    if (slot instanceof RoguelikeSaveFile)
    return (slot as RoguelikeSaveFile).bestRun.highestBlock
    return slot.progress.highestBlock
  }
  
  function getRun(slot?: RoguelikeSaveFile | SaveFile) {
    if (slot && slot instanceof RoguelikeSaveFile)
      return (slot as RoguelikeSaveFile).progress.run
    return 0
  }

  function getCoins(slot?: RoguelikeSaveFile | SaveFile) {
    if ( slot && slot instanceof RoguelikeSaveFile)
      return (slot as RoguelikeSaveFile).inventory.coins
    return 0
  }
</script>

<style lang="scss">
  .save-modal {
    &__list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
</style>
