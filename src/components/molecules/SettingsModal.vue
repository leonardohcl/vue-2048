<template>
  <v-dialog v-model="isOpen" class="settings-modal" max-width="300">
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
        <v-slide-x-reverse-transition>
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
        </v-slide-x-reverse-transition>
        <small
          v-if="game.isRunning"
          class="d-inline-block text-warning font-italic w-100 text-right"
          >Saving changes will start a new game!</small
        >

        <button type="submit" hidden />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn @click="close" color="error" prepend-icon="fas fa-fw fa-times"
          >Cancel</v-btn
        >
        <v-btn
          @click="updateSettings"
          color="success"
          prepend-icon="fas fa-fw fa-save"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import GameController from "@/model/2048 Standard/GameController";
import { ref, watch } from "vue";
import useDialogCommands from "@/composables/dialogCommands";

export default {
  props: {
    game: {
      type: GameController,
      required: true,
    },
  },
  emits: ["open", "update", "close"],
  setup(props, context) {
    const width = ref(4);
    const height = ref(4);
    const allowUndo = ref(true);
    const undoHistorySize = ref(2);

    const { open, close, isOpen } = useDialogCommands(context);

    const updateSettings = () => {
      context.emit("update", {
        width: width.value,
        height: height.value,
        historySize: allowUndo.value ? undoHistorySize.value : 0,
      });
      close();
    };

    const handleOpenModal = () => {
      width.value = props.game.width;
      height.value = props.game.height;
      allowUndo.value = props.game.historySize > 0;
      undoHistorySize.value = props.game.historySize;
    };

    watch(isOpen, (open) => {
      if (open) handleOpenModal();
    });

    return {
      isOpen,
      width,
      height,
      allowUndo,
      undoHistorySize,
      open,
      close,
      updateSettings,
      handleOpenModal,
    };
  },
};
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
