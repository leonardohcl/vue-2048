<template>
  <Btn
    v-bind="saveButtonAttrs"
    v-b-modal="`${id}-memory`"
    @click="mode = 'save'"
    v-if="allowSave"
  />
  <Btn
    v-bind="loadButtonAttrs"
    v-b-modal="`${id}-memory`"
    @click="mode = 'load'"
    v-if="allowLoad"
  />
  <SaveModal
    :id="`${id}-memory`"
    @selected="handleSelected"
    :close-after-select="closeAfterSelect"
    :mode="mode"
    :game-mode="gameMode"
  />
</template>

<script>
  import GameMode from '@/model/GameMode'
  import Btn from '@/components/atoms/Btn.vue'
  import SaveModal from '@/components/molecules/SaveModal.vue'

  import { computed, ref } from 'vue'

  export default {
    components: { Btn, SaveModal },
    props: {
      id: { type: String, default: 'main-game' },
      allowSave: { type: Boolean, default: true },
      allowLoad: { type: Boolean, default: true },
      saveButtonOptions: {
        type: Object,
        default: () => ({}),
      },
      loadButtonOptions: {
        type: Object,
        default: () => ({}),
      },
      closeOnLoad: { type: Boolean, default: false },
      closeOnSave: { type: Boolean, default: false },
      gameMode: { type: GameMode, default: 'regular' },
    },
    emits: ['save', 'load'],
    setup(props, context) {
      const saveButtonAttrs = computed(() => ({
        theme: 'plain',
        isIcon: true,
        icon: 'floppy-disk',
        outlined: true,
        ...props.saveButtonOptions,
      }))

      const loadButtonAttrs = computed(() => ({
        theme: 'plain',
        isIcon: true,
        icon: 'folder-open',
        outlined: true,
        ...props.loadButtonOptions,
      }))

      const mode = ref('')

      const closeAfterSelect = computed(() => {
        const flags = {
          load: props.closeOnLoad,
          save: props.closeOnSave,
        }

        return flags[mode.value]
      })

      const handleSelected = (slot) => {
        if (mode.value === 'load' && slot.isEmpty) return
        context.emit(mode.value, slot)
      }

      return {
        mode,
        saveButtonAttrs,
        loadButtonAttrs,
        closeAfterSelect,
        handleSelected,
      }
    },
  }
</script>
