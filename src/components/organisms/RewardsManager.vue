<template>
  <RewardsModal :rewards="rewards" ref="rewardsModal" />
</template>

<script lang="ts">
  import RewardsModal from '@/components/molecules/RewardsModal.vue'
  import { ref, defineComponent, computed } from 'vue'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import GameRewards from '@/model/2048 Roguelike/GameRewards'

  export default defineComponent({
    components: { RewardsModal },
    props: {
      game: {
        type: RoguelikeGameController,
        required: true,
      },
    },
    setup(props) {
      const rewards = ref(props.game.getRewards())
      const rewardsModal = ref()

      const open = () => {
        rewards.value = props.game.getRewards()
        if (!rewards.value.totalEarned) return
        rewardsModal.value?.open()
      }

      return { rewards, rewardsModal, open }
    },
  })
</script>
