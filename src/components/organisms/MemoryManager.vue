<template>
  <v-btn
    v-if="allowSave"
    v-bind="saveButtonAttrs"
    @click="handleOpenModal('save')"
  >
    {{ saveButtonAttrs.text || "" }}
  </v-btn>
  <v-btn
    v-if="allowLoad"
    v-bind="loadButtonAttrs"
    @click="handleOpenModal('load')"
  >
    {{ loadButtonAttrs.text || "" }}
  </v-btn>

  <SaveModal
    @selected="handleSelected"
    :close-after-select="closeAfterSelect"
    :mode="mode"
    :game-mode="gameMode"
    :theme="theme"
    ref="saveModal"
  />
</template>

<script>
import GameMode from "@/model/GameMode";
import SaveModal from "@/components/molecules/SaveModal.vue";

import { computed, ref } from "vue";

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
    gameMode: { type: String, default: GameMode.Standard },
  },
  emits: ["save", "load"],
  setup(props, context) {
    const btnSettings = {
      variant: "plain",
    };

    const saveButtonAttrs = computed(() => ({
      prependIcon: "fas fa-fw fa-floppy-disk",
      ...btnSettings,
      ...props.saveButtonOptions,
    }));

    const loadButtonAttrs = computed(() => ({
      prependIcon: "fas fa-fw fa-folder-open",
      ...btnSettings,
      ...props.loadButtonOptions,
    }));

    const mode = ref("");

    const closeAfterSelect = computed(() => {
      const flags = {
        load: props.closeOnLoad,
        save: props.closeOnSave,
      };

      return flags[mode.value];
    });

    const handleSelected = (slot) => {
      if (mode.value === "load" && slot.isEmpty) return;
      context.emit(mode.value, slot);
    };

    const saveModal = ref();

    const handleOpenModal = (gameMode) => {
      mode.value = gameMode;
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
