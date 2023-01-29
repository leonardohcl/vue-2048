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
            v-for="slot in slots"
            :key="slot.filename"
            :theme="theme"
            :save="slot"
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

<script>
import useDialogCommands from "@/mixins/dialogCommands";
import SaveSlot from "@/components/atoms/SaveSlot.vue";
import { computed } from "vue";
import { useStore } from "vuex";

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
    const saves = computed(() => store.getters.saves(props.gameMode));

    const slots = computed(() => {
      const list = [];

      for (let idx = 1; idx <= props.maxSlots; idx++) {
        const filename = `slot-${idx}`;
        const existing = saves.value.find((x) => x.filename === filename);
        if (existing) list.push(existing);
        else list.push({ filename, isEmpty: true });
      }

      return list;
    });

    const { isOpen, open, close } = useDialogCommands();

    const handleSelect = (slot) => {
      context.emit("selected", slot);
      if (props.closeAfterSelect) close();
    };

    return { isOpen, slots, handleSelect, isOpen, open, close };
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
