<template>
  <div class="leaderboard">
    <v-btn v-bind="buttonAttrs" @click="leaderboardModal.open()">
      <slot />
    </v-btn>
    <LeaderboardModal
      :leaderboard="game.leaderboard ?? []"
      :with-board="withBoard"
      :with-run="withRun"
      ref="leaderboardModal"
    />
  </div>
</template>

<script lang="ts">
import LeaderboardModal from "@/components/molecules/LeaderboardModal.vue";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import GameController from "@/model/2048 Standard/GameController";
import LooseObject from "@/utils/LooseObject";

import { computed, ref } from "vue";

export default {
  components: { LeaderboardModal },
  props: {
    game: { type: [GameController, RoguelikeGameController], required: true },
    buttonOptions: {
      type: Object,
      default: () => ({}),
    },
    withRun: {
      type: Boolean,
      default: false,
    },
    withBoard: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonAttrs = computed<LooseObject>(() => ({
      variant: "plain",
      prependIcon: "fas fa-fw fa-ranking-star",
      ...props.buttonOptions,
    }));

    const leaderboardModal = ref();

    return {
      buttonAttrs,
      leaderboardModal,
    };
  },
};
</script>
