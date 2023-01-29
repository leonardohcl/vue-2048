<template>
  <RewardsModal :rewards="rewards" ref="rewardsModal" />
</template>

<script>
import GameRewards from "@/model/roguelike/GameRewards";
import GameController from "@/model/2048/GameController";
import RewardsModal from "@/components/molecules/RewardsModal.vue";
import { ref } from "vue";

export default {
  components: { RewardsModal },
  props: {
    game: {
      type: GameController,
      required: true,
    },
  },
  emits: ["loot"],
  setup(props,context) {
    const rewards = ref({});
    const rewardsModal = ref();

    const getRewards = () => {
      rewards.value = new GameRewards(props.game);
    };

    const lootRewards = () => {
      getRewards();
      rewardsModal.value?.open();
      context.emit("loot", rewards.value.totalEarned);
    };

    return { rewards, rewardsModal, getRewards, lootRewards };
  },
};
</script>
