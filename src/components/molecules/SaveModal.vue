<template>
  <v-dialog class="save-modal" v-model="isOpen" max-width="400px">
    <v-card
      title="Memory Card"
      :subtitle="`[${mode.toUpperCase()} GAME]`"
      prepend-icon="fas fa-fw fa-sd-card"
    >
      <v-card-text>
        <ul class="save-modal__list">
          <SaveSlot
            v-for="key in slotList"
            :key="key"
            :memory-card-key="key"
            :theme="theme"
            :save="slots[key]"
            :mode="mode"
            @select="handleSelect"
          />
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import useDialogCommands from "@/composables/dialogCommands";
import SaveSlot from "@/components/atoms/SaveSlot.vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { SlotName, SLOT_NAMES } from "@/composables/memoryCard";
import SaveFile from "@/model/2048 Standard/SaveFile";
import RoguelikeSaveFile from "@/model/2048 Roguelike/RogueSaveFile";

export default {
  components: { SaveSlot },
  props: {
    mode: { type: String, default: "" },
    theme: { type: String, default: "primary" },
    maxSlots: { type: Number, default: 5 },
    closeAfterSelect: { type: Boolean, default: false },
    gameMode: { type: String, required: true },
  },
  emits: ["selected"],
  setup(props, context) {
    const store = useStore();
    const slots = computed(() => store.getters.slots(props.gameMode));
    const slotList = computed(() =>
      SLOT_NAMES.filter((x) => x !== SlotName.LastGame)
    );

    const { isOpen, open, close } = useDialogCommands();

    const handleSelect = (data: {
      key: string;
      slot: SaveFile | RoguelikeSaveFile;
    }) => {
      context.emit("selected", data);
      if (props.closeAfterSelect) close();
    };

    return { isOpen, slots, slotList, handleSelect, open, close };
  },
};
</script>

<style lang="scss">
.save-modal {
  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>
