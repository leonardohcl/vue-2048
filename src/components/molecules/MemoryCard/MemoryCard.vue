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
          :save="slots[name]"
          :mode="mode"
          @select="handleSelect"
        />
      </ul>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
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

  export default {
    components: { SaveSlot },
    props: {
      mode: { default: MemoryCardMode.Load },
      memoryCard: { type: MemoryCard, required: true },
    },
    emits: ['select'],
    setup(props, context) {
      const slotList = computed(() =>
        SLOTS_AVAILABLE.filter((x) => x !== SlotName.LastGame)
      )

      const slots = computed(
        () =>
          props.memoryCard.slots as LooseObject<SaveFile | RoguelikeSaveFile>
      )

      const handleSelect = (slotName: SlotName) => {
        context.emit('select', slotName)
      }

      return { slots, slotList, handleSelect }
    },
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
