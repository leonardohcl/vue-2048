<template>
  <div class="memory-manager">
    <v-btn
      v-if="allowSave"
      v-bind="saveButtonAttrs"
      @click="handleOpenModal('save')"
    >
      <slot name="save-button" />
    </v-btn>
    <v-btn
      v-if="allowLoad"
      v-bind="loadButtonAttrs"
      @click="handleOpenModal('load')"
    >
      <slot name="load-button" />
    </v-btn>

    <SaveModal
      @selected="handleSelected"
      :close-after-select="closeAfterSelect"
      :mode="mode"
      :memory-card="game?.memoryCard ?? memoryCard"
      :theme="theme"
      ref="saveModal"
    />
  </div>
</template>

<script lang="ts">
import GameMode from "@/model/Game Utils/GameMode";
import SaveModal from "@/components/molecules/SaveModal.vue";

import { computed, ref } from "vue";
import GameController from "@/model/2048 Standard/GameController";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import SaveFile from "@/model/Game Utils/SaveFile/SaveFile";
import LooseObject from "@/utils/LooseObject";
import MemoryCard, { SlotName } from "@/model/Game Utils/MemoryCard";

const enum ManagerState {
  Load = "load",
  Save = "save",
}

export default {
  components: { SaveModal },
  props: {
    theme: { type: String, default: "primary" },
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
    memoryCard: {
      type: MemoryCard,
      default: () => new MemoryCard<SaveFile>(GameMode.Standard),
    },
  },
  emits: ["save", "load"],
  setup(props, context) {
    const btnSettings = {
      variant: "plain",
    };

    const saveButtonAttrs = computed<LooseObject>(() => ({
      prependIcon: "fas fa-fw fa-floppy-disk",
      disabled: props.game?.moves === 0 ?? true,
      ...btnSettings,
      ...props.saveButtonOptions,
    }));

    const loadButtonAttrs = computed<LooseObject>(() => ({
      prependIcon: "fas fa-fw fa-folder-open",
      ...btnSettings,
      ...props.loadButtonOptions,
    }));

    const mode = ref<ManagerState>(ManagerState.Load);

    const closeAfterSelect = computed(() => {
      const flags = {
        load: props.closeOnLoad,
        save: props.closeOnSave,
      };

      return flags[mode.value];
    });

    const handleSelected = (slotName: SlotName) => {
      if (mode.value === ManagerState.Load) handleLoad(slotName);
      else if (mode.value === ManagerState.Save) handleSave(slotName);
      if (closeAfterSelect.value) saveModal.value?.close();
    };

    const handleLoad = (slotName: SlotName) => {
      props.game?.load(slotName);
      context.emit("load", slotName);
    };

    const handleSave = (slotName: SlotName) => {
      if (props.game) props.game.save(slotName);
      context.emit("save", slotName);
    };

    const saveModal = ref();

    const handleOpenModal = (state: string) => {
      mode.value = state as ManagerState;
      saveModal.value?.open();
    };

    return {
      mode,
      saveModal,
      saveButtonAttrs,
      loadButtonAttrs,
      closeAfterSelect,
      handleOpenModal,
      handleSelected,
    };
  },
};
</script>
