<template>
  <v-btn v-bind="buttonAttrs" @click="settingsModal?.open()">
    {{ buttonAttrs.text }}
  </v-btn>
  <SettingsModal
    :game="game"
    ref="settingsModal"
    @open="game.pause(true)"
    @close="game.pause(false)"
    @update="handleUpdate"
  />
</template>

<script lang="ts">
  import GameController from '@/model/2048 Standard/GameController'
  import SettingsModal from '@/components/molecules/SettingsModal.vue'

  import { computed, ref } from 'vue'
import { IGameSettings } from '@/model/Game Utils/SaveFile/interfaces/GameSettings'
import LooseObject from '@/utils/LooseObject'

  export default {
    components: { SettingsModal },
    props: {
      id: { type: String, default: 'main-game' },
      buttonOptions: {
        type: Object,
        default: () => ({}),
      },
      game: {
        type: GameController,
        required: true,
      },
    },
    emits: ['open', 'update', 'close'],
    setup(props, context) {
      const buttonAttrs = computed<LooseObject>(() => ({
        variant: 'plain',
        prependIcon: 'fas fa-fw fa-gears',
        ...props.buttonOptions,
      }))

      const settingsModal = ref()

      const handleUpdate = (newSettings:IGameSettings) => {
        props.game.updateSettings(newSettings)
        context.emit('update', newSettings)
      }

      return {
        buttonAttrs,
        settingsModal,
        handleUpdate,
      }
    },
  }
</script>
