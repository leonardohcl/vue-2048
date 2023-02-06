<template>
  <v-btn
    v-if="allowSave"
    v-bind="saveButtonAttrs"
    @click="handleOpenModal('save')"
  >
    {{ saveButtonAttrs.text || '' }}
  </v-btn>
  <v-btn
    v-if="allowLoad"
    v-bind="loadButtonAttrs"
    @click="handleOpenModal('load')"
  >
    {{ loadButtonAttrs.text || '' }}
  </v-btn>

  <SaveModal
    @selected="handleSelected"
    :close-after-select="closeAfterSelect"
    :mode="mode"
    :memory-card="memoryCard"
    :theme="theme"
    ref="saveModal"
  />
</template>

<script lang="ts">
  import GameMode from '@/model/Game Utils/GameMode'
  import SaveModal from '@/components/molecules/SaveModal.vue'

  import { computed, inject, reactive, ref } from 'vue'
  import GameController from '@/model/2048 Standard/GameController'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import { RoguelikeMemoryCard, StandardMemoryCard } from '@/keys'
  import MemoryCard, { SlotName } from '@/model/Game Utils/MemoryCard'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import LooseObject from '@/utils/LooseObject'

  const enum ManagerState {
    Load = 'load',
    Save = 'save',
  }

  export default {
    components: { SaveModal },
    props: {
      theme: { type: String, default: 'primary' },
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
      game: { type: [GameController, RoguelikeGameController] },
      gameMode: { default: GameMode.Standard },
    },
    emits: ['save', 'load'],
    setup(props, context) {
      const btnSettings = {
        variant: 'plain',
      }

      const saveButtonAttrs = computed<LooseObject>(() => ({
        prependIcon: 'fas fa-fw fa-floppy-disk',
        ...btnSettings,
        ...props.saveButtonOptions,
      }))

      const loadButtonAttrs = computed<LooseObject>(() => ({
        prependIcon: 'fas fa-fw fa-folder-open',
        ...btnSettings,
        ...props.loadButtonOptions,
      }))

      const mode = ref<ManagerState>(ManagerState.Load)

      const memoryCards = reactive({
        [GameMode.Standard]: inject(StandardMemoryCard),
        [GameMode.Roguelike]: inject(RoguelikeMemoryCard),
      })

      const memoryCard = computed(() => {
        const gameMode =
          props.game != undefined
            ? props.game instanceof RoguelikeGameController
              ? GameMode.Roguelike
              : GameMode.Standard
            : props.gameMode

          return memoryCards[gameMode] ?? new MemoryCard<RoguelikeSaveFile>(gameMode)
      })

      const closeAfterSelect = computed(() => {
        const flags = {
          load: props.closeOnLoad,
          save: props.closeOnSave,
        }

        return flags[mode.value]
      })

      const handleSelected = ({
        slotName,
        slot,
      }: {
        slotName: SlotName
        slot: SaveFile | RoguelikeSaveFile
      }) => {
        if (mode.value === ManagerState.Load) handleLoad(slotName, slot)
        else if (mode.value === ManagerState.Save) handleSave(slotName)
        if (closeAfterSelect.value) saveModal.value?.close()
      }

      const handleLoad = (
        slotName: SlotName,
        slot: SaveFile | RoguelikeSaveFile
      ) => {
        props.game?.load(slot)
        context.emit('load', { slotName, slot })
      }

      const handleSave = (slotName: SlotName) => {
        if (props.game)
          memoryCard.value.save(props.game.getSaveFile(), slotName)
        context.emit('save', slotName)
      }

      const saveModal = ref()

      const handleOpenModal = (state: string) => {
        mode.value = state as ManagerState
        saveModal.value?.open()
      }

      return {
        mode,
        memoryCard,
        saveModal,
        saveButtonAttrs,
        loadButtonAttrs,
        closeAfterSelect,
        handleOpenModal,
        handleSelected,
      }
    },
  }
</script>
