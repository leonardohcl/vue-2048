<template>
  <v-dialog class="save-modal" v-model="isOpen" max-width="400px">
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
            :theme="theme"
            :save="slots[name]"
            :mode="mode"
            @select="handleSelect"
          />
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import useDialogCommands from '@/composables/dialogCommands'
  import SaveSlot from '@/components/atoms/SaveSlot.vue'
  import { computed } from 'vue'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import MemoryCard, {
    SlotName,
    SLOTS_AVAILABLE,
  } from '@/model/Game Utils/MemoryCard'
  import LooseObject from '@/utils/LooseObject'

  export default {
    components: { SaveSlot },
    props: {
      mode: { type: String, default: '' },
      theme: { type: String, default: 'primary' },
      closeAfterSelect: { type: Boolean, default: false },
      memoryCard: { type: MemoryCard, required: true },
    },
    emits: ['selected'],
    setup(props, context) {
      const slotList = computed(() =>
        SLOTS_AVAILABLE.filter((x) => x !== SlotName.LastGame)
      )

      const slots = computed(
        () =>
          props.memoryCard.slots as LooseObject<SaveFile | RoguelikeSaveFile>
      )

      const { isOpen, open, close } = useDialogCommands()

      const handleSelect = (slotName: SlotName) => {
        context.emit('selected', slotName)
        if (props.closeAfterSelect) close()
      }

      return { isOpen, slots, slotList, handleSelect, open, close }
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
