<template>
  <v-card
    tag="form"
    prepend-icon="fas fa-fw fa-cogs"
    title="Settings"
    @submit.prevent="updateSettings"
  >
    <v-card-text>
      <b class="settings-modal--section-title">Board</b>
      <v-slider
        class="settings-modal__slider"
        color="primary"
        label="width"
        min="3"
        max="8"
        step="1"
        v-model="width"
        show-ticks="always"
        :ticks="[3, 4, 5, 6, 7, 8]"
      />
      <v-slider
        class="settings-modal__slider"
        color="primary"
        label="height"
        min="3"
        max="8"
        step="1"
        v-model="height"
        show-ticks="always"
        :ticks="[3, 4, 5, 6, 7, 8]"
      />
      <hr class="mb-4 opacity--50" />
      <b class="settings-modal--section-title">Gameplay</b>
      <v-switch
        :label="`undo ${allowUndo ? 'enabled' : 'disabled'}`"
        color="primary"
        v-model="allowUndo"
        hide-details
      />
      <Transition name="scroll-x">
        <v-slider
          v-if="allowUndo"
          class="settings-modal__slider"
          color="primary"
          label="undos"
          min="1"
          max="5"
          step="1"
          v-model="undoHistorySize"
          show-ticks="always"
          :ticks="[1, 2, 3, 4, 5]"
        />
      </Transition>
      <small
        v-if="game.isRunning"
        class="d-inline-block text-warning font-italic w-100 text-right"
        >Saving changes will start a new game!</small
      >

      <button type="submit" hidden />
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn
        @click="updateSettings"
        color="success"
        prepend-icon="fas fa-fw fa-save"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import GameController from '@/model/2048 Standard/GameController'
  import { ref, computed, watch, onMounted } from 'vue'

  const props = defineProps({
    game: { type: GameController, required: true },
  })

  const emit = defineEmits(['update'])

  const width = ref(4)
  const height = ref(4)
  const allowUndo = ref(true)
  const undoHistorySize = ref(2)

  const gameWidth = computed(() => props.game.width)
  const gameHeight = computed(() => props.game.height)
  const gameUndoHistorySize = computed(() => props.game.historySize)

  function updateSettings() {
    const newSettings = {
      width: width.value,
      height: height.value,
      historySize: allowUndo.value ? undoHistorySize.value : 0,
      winningBlock: 2048
    }
    emit('update', newSettings)
    props.game.updateSettings(newSettings)
  }

  function loadGameData() {
    width.value = props.game.width
    height.value = props.game.height
    allowUndo.value = props.game.historySize > 0
    undoHistorySize.value = props.game.historySize
  }

  watch([gameWidth, gameHeight, gameUndoHistorySize], () => {
    loadGameData()
  })

  onMounted(() => {
    loadGameData()
  })
</script>

<style lang="scss">
  .settings-modal {
    &--section-title {
      font-size: 1.1rem;
      display: inline-block;
      font-weight: bold;
      margin-bottom: $default-spacing * 0.25;
    }

    &__slider {
      grid-template-columns: minmax(0, 33%) minmax(0, 1fr) max-content !important;
    }
  }
</style>
