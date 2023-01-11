<template>
  <b-modal
    :id="id"
    ref="modal"
    v-model="isOpen"
    centered
    title="Settings"
    size="sm"
    class="settings-modal"
    @show="handleOpenModal"
    @hidden="close"
  >
    <form @submit.prevent="updateSettings">
      <b class="settings-modal--section-title">Board</b>
      <b-form-group label="Width" :lable-for="`${id}--width`" label-cols-md="3">
        <b-form-spinbutton
          v-model="width"
          :id="`${id}--width`"
          max="8"
          min="3"
        />
      </b-form-group>
      <b-form-group
        label="Height"
        :lable-for="`${id}--height`"
        label-cols-md="3"
      >
        <b-form-spinbutton
          v-model="height"
          :id="`${id}--height`"
          max="8"
          min="3"
        />
      </b-form-group>
      <hr />
      <b class="settings-modal--section-title">Gameplay</b>
      <b-form-group>
        <b-form-checkbox v-model="allowUndo" switch>
          Undo move is {{ allowUndo ? 'enabled' : 'disabled' }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group
        label="Undos allowed"
        :lable-for="`${id}--undo-history-size`"
        label-cols-md
        v-if="allowUndo"
      >
        <b-form-spinbutton
          v-model="undoHistorySize"
          :id="`${id}--undo-history-size`"
          max="5"
          min="1"
        />
      </b-form-group>
      <button type="submit" hidden/>
    </form>

    <template v-slot:modal-footer>
      <Btn text="Cancel" outlined @click="isOpen = false" />
      <Btn text="Save" @click="updateSettings" v-b-tooltip.hover title="Saving changes will start a new game" />
      <br>
      <small class="d-md-none font-italic">Saving changes will start a new game</small>
    </template>
  </b-modal>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import { BFormGroup, BFormSpinbutton, BFormCheckbox } from 'bootstrap-vue'
  import Btn from '@/components/atoms/Btn'
  import { ref } from 'vue'

  export default {
    components: { BFormGroup, BFormSpinbutton, BFormCheckbox, Btn },
    props: {
      id: {
        type: String,
        required: true,
      },
      game: {
        type: GameController,
        required: true,
      },
    },
    emits: ['open', 'update', 'close'],
    setup(props, context) {
      const width = ref(4)
      const height = ref(4)
      const allowUndo = ref(true)
      const undoHistorySize = ref(2)
      const isOpen = ref(false)

      const close = (evt) => {
        context.emit('close', evt)
      }

      const updateSettings = () => {
        context.emit('update', {
          width: width.value,
          height: height.value,
          historySize: allowUndo.value ? undoHistorySize.value : 0,
        })
        isOpen.value = false
      }

      const handleOpenModal = (evt) => {
        context.emit('open', evt)

        width.value = props.game.width
        height.value = props.game.height
        allowUndo.value = props.game.historySize > 0
        undoHistorySize.value = props.game.historySize
      }

      return {
        isOpen,
        width,
        height,
        allowUndo,
        undoHistorySize,
        close,
        updateSettings,
        handleOpenModal,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .settings-modal {
    &--section-title {
      font-size: 1.1rem;
      display: inline-block;
      font-weight: bold;
      margin-bottom: $default-spacing/4;
    }
  }
</style>
