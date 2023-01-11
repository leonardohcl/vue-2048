<template>
  <Btn v-bind="buttonAttrs" v-b-modal="`${id}-settings`">
    <FontAwesomeIcon :icon="buttonAttrs.icon" v-if="buttonAttrs.isIcon" />
  </Btn>
  <SettingsModal
    :id="`${id}-settings`"
    :game="game"
    @open="handleOpen"
    @close="handleClose"
    @update="handleUpdate"
  />
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import GameController from '@/model/2048/GameController'
  import SettingsModal from '@/components/molecules/SettingsModal.vue'

  import { computed } from 'vue'

  export default {
    components: { Btn, SettingsModal },
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
      const buttonAttrs = computed(() => ({
        theme: 'plain',
        isIcon: true,
        icon: 'gears',
        outlined: true,
        ...props.buttonOptions,
      }))

      const handleOpen = (evt) => {
        context.emit('open', evt)
      }

      const handleClose = (evt) => {
        context.emit('close', evt)
      }

      const handleUpdate = (data) => {
        context.emit('update', data)
      }

      return {
        buttonAttrs,
        handleOpen,
        handleClose,
        handleUpdate,
      }
    },
  }
</script>
