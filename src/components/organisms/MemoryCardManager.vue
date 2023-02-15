<template>
  <SaveModal
    @select="handleSelected"
    :mode="mode"
    :memory-card="game.memoryCard"
    ref="saveModal"
  />
</template>

<script lang="ts">
  import SaveModal from '@/components/molecules/MemoryCard/MemoryCard.vue'

  import GameController from '@/model/2048 Standard/GameController'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import  {
    MemoryCardMode,
    SlotName,
  } from '@/model/Game Utils/MemoryCard'

  export default {
    components: { SaveModal },
    props: {
      game: { type: [GameController, RoguelikeGameController], required: true },
      mode: { default: MemoryCardMode.Load },
    },
    emits: ['save', 'load'],
    setup(props, context) {
      const handleSelected = (slotName: SlotName) => {
        if (props.mode === MemoryCardMode.Load) handleLoad(slotName)
        else if (props.mode === MemoryCardMode.Save) handleSave(slotName)
      }

      const handleLoad = (slotName: SlotName) => {
        props.game?.load(slotName)
        context.emit('load', slotName)
      }

      const handleSave = (slotName: SlotName) => {
        if (props.game) props.game.save(slotName)
        context.emit('save', slotName)
      }

      return {
        handleSelected,
      }
    },
  }
</script>
