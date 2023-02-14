<template>
  <v-dialog width="300" v-model="isOpen">
    <Rewards :rewards="rewards" ref="rewardsModal" />
  </v-dialog>
</template>

<script lang="ts">
  import Rewards from '@/components/molecules/Rewards/Rewards.vue'
  import { ref, defineComponent } from 'vue'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'

  export default defineComponent({
    components: { Rewards },
    props: {
      game: {
        type: RoguelikeGameController,
        required: true,
      },
    },
    setup(props) {
      const rewards = ref(props.game.getRewards())
      const isOpen = ref(false)

      const open = () => {
        rewards.value = props.game.getRewards()
        if (!rewards.value.totalEarned) return
        isOpen.value = true
      }

      return { rewards, isOpen, open }
    },
  })
</script>
