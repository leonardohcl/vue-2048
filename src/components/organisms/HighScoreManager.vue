<template>
  <v-btn
    v-if="useSubmit"
    size="small"
    variant="text"
    color="secondary"
    prepend-icon="fas fa-fw fa-award"
    :disabled="disabled"
    @click="saveScoreModal?.open"
  >
    {{ submitText }}
  </v-btn>
  <SaveScoreModal
    :id="`${id}-new-highscore`"
    :entry="entry"
    @submit="saveScore"
    ref="saveScoreModal"
  />
</template>

<script>
import SaveScoreModal from "@/components/molecules/SaveScoreModal.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { ADD_SCORE_ACTION } from "@/store/ranking";

import GameController from "@/model/2048 Standard/GameController";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";

export default {
  components: { SaveScoreModal },
  props: {
    id: {
      type: String,
      default: "main-game",
    },
    rankingId: {
      type: String,
      required: true,
    },
    game: {
      type: [GameController, RoguelikeGameController],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    useSubmit: {
      type: Boolean,
      default: false,
    },
    submitText: {
      type: String,
      default: "Submit Score",
    },
  },
  emits: ["save"],
  setup(props, context) {
    const saveScoreModal = ref();

    const entry = computed(() => {
      if (!props.game.gameOver && !props.game.winner) return;

      const gameEntry = props.game.getRankingEntry();
      gameEntry.id = props.rankingId;
      return gameEntry
    });

    const store = useStore();

    const ranking = computed(() => store.getters.ranking(props.rankingId));

    const highScores = computed(() => {
      if (ranking.value.length > 0)
        return {
          first: ranking.value[0].score,
          last: ranking.value[ranking.value.length - 1].score,
          count: ranking.value.length,
        };

      return {
        first: 0,
        last: 0,
        count: 0,
      };
    });

    const isRankingWorthy = (score = entry.score || 0) =>
      score
        ? highScores.value.count < 10 || score > highScores.value.last
        : false;

    const saveScore = (rankingEntry) => {
      if (!isRankingWorthy(rankingEntry.score)) return;
      store.dispatch(ADD_SCORE_ACTION, rankingEntry);
      context.emit("save");
    };

    const triggerDialog = () => {
      saveScoreModal.value?.open();
    };

    return {
      entry,
      saveScoreModal,
      saveScore,
      triggerDialog,
      isRankingWorthy,
    };
  },
};
</script>
