<template>
  <RewardsModal :rewards="rewards" ref="rewardsModal" />
</template>

<script lang="ts">
import GameRewards from "@/model/roguelike/GameRewards";
import GameController from "@/model/2048/GameController";
import RewardsModal from "@/components/molecules/RewardsModal.vue";
import { ref, defineComponent } from "vue";

export default defineComponent({
  components: { RewardsModal },
  props: {
    game: {
      type: GameController,
      required: true,
    },
  },
  emits: ["loot"],
  setup(props, context) {
    const rewards = ref(new GameRewards(props.game));
    const rewardsModal = ref();

    const getRewards = () => {
      return new GameRewards(props.game);
    };

    const lootRewards = () => {
      rewards.value = getRewards();
      rewardsModal.value?.open();
      context.emit("loot", rewards.value.totalEarned);
    };

    return { rewards, rewardsModal, getRewards, lootRewards };
  },
});
</script>
