<template>
  <v-dialog v-model="isOpen" class="save-score-modal" max-width="500">
    <v-card
      tag="form"
      @submit.prevent="saveScore"
      title="New Score!"
      prepend-icon="fas fa-fw fa-trophy"
    >
      <v-card-text class="save-score-modal__content">
        <v-text-field
          placeholder="Your name"
          v-model="username"
          hide-details
          required
        />
        <div class="save-score-modal__data">
          <DataChip :value="entry.score" theme="score" />
          <DataChip
            :value="entry.run"
            theme="run"
            v-if="entry.run != undefined"
          />
          <DataChip :value="entry.moves" theme="moves" />
          <DataChip :value="entry.undos" theme="undos" />
        </div>

        <Square
          class="save-score-modal--square mx-auto"
          :value="entry.block"
          inline
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="close" color="error" prepend-icon="fas fa-fw fa-times"
          >Cancel</v-btn
        >
        <v-btn
          @click="saveScore"
          color="success"
          prepend-icon="fas fa-fw fa-save"
          :disabled="!username"
          >Save</v-btn
        >
      </v-card-actions>
      <button hidden type="submit" />
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import Square from "@/components/atoms/Square.vue";
import DataChip from "@/components/atoms/DataChip.vue";
import { ADD_SCORE_ACTION } from "@/store/ranking";
import { useStore } from "vuex";
import RoguelikeRankingEntry from "@/model/roguelike/RankingEntry";
import RankinEntry from "@/model/2048/RankingEntry";
import useDialogCommands from "@/mixins/dialogCommands";

export default {
  components: { Square, DataChip },
  props: {
    entry: {
      type: [RankinEntry, RoguelikeRankingEntry, Object],
      required: true,
    },
  },
  setup(props) {
    const username = ref("");

    const store = useStore();

    const { isOpen, open, close } = useDialogCommands();

    const saveScore = () => {
      store.dispatch(ADD_SCORE_ACTION, {
        ...props.entry,
        name: username.value,
      });
      close();
    };

    return { username, isOpen, open, close, saveScore };
  },
};
</script>

<style lang="scss">
.save-score-modal {
  &__content {
    display: grid;
    align-items: center;
    gap: $default-spacing * 0.5;
    grid-template-columns: 1fr max-content min-content;
  }

  &__data {
    display: flex;
    flex-wrap: wrap;
    gap: $default-spacing * 0.25;
  }
}
</style>