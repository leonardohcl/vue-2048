<template>
  <v-btn v-bind="buttonAttrs" @click="settingsModal?.open()">
    {{ buttonAttrs.text }}
  </v-btn>
  <SettingsModal
    :game="game"
    ref="settingsModal"
    @open="handleOpen"
    @close="handleClose"
    @update="handleUpdate"
  />
</template>

<script>
import GameController from '@/model/2048 Standard/GameController';
import SettingsModal from '@/components/molecules/SettingsModal.vue'

import { computed, ref } from "vue";

export default {
  components: { SettingsModal },
  props: {
    id: { type: String, default: "main-game" },
    buttonOptions: {
      type: Object,
      default: () => ({}),
    },
    game: {
      type: GameController,
      required: true,
    },
  },
  emits: ["open", "update", "close"],
  setup(props, context) {
    const buttonAttrs = computed(() => ({
      variant: "plain",
      prependIcon: "fas fa-fw fa-gears",
      ...props.buttonOptions,
    }));

    const settingsModal = ref();

    const handleOpen = (evt) => {
      context.emit("open", evt);
    };

    const handleClose = (evt) => {
      context.emit("close", evt);
    };

    const handleUpdate = (data) => {
      context.emit("update", data);
    };

    return {
      buttonAttrs,
      settingsModal,
      handleOpen,
      handleClose,
      handleUpdate,
    };
  },
};
</script>
