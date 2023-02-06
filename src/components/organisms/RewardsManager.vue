<template>
  <RewardsModal :rewards="rewards" ref="rewardsModal" />
</template>

<script lang="ts">
import RewardsModal from "@/components/molecules/RewardsModal.vue";
import { ref, defineComponent, watch, computed } from "vue";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";

export default defineComponent({
  components: { RewardsModal },
  props: {
    game: {
      type: RoguelikeGameController,
      required: true,
    },
  },
  setup(props) {
    const rewards = computed(() => props.game.rewards);
    const rewardsModal = ref();

    watch(rewards, (hasLoot) => {
      if (!hasLoot) return;
      rewardsModal.value?.open();
    });

    return { rewards, rewardsModal };
  },
});
</script>
