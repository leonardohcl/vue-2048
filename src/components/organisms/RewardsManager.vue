<template>
  <RewardsModal :id="`${id}-rewards`" :rewards="rewards" />
</template>

<script>
  import GameRewards from '@/model/roguelike/GameRewards'
  import GameController from '@/model/2048/GameController'
  import RewardsModal from '@/components/molecules/RewardsModal.vue'
  import { ref } from 'vue'

  export default {
    components: { RewardsModal },
    props: {
      id: { type: String, default: 'main-game' },
      buttonOptions: {
        type: Object,
        default: () => ({}),
      },
      game: {
        type: GameController,
        required: true,
      },
    },
    methods: {
      lootRewards() {
        this.getRewards()
        this.$bvModal.show(`${this.id}-rewards`)
        this.$emit('reward-earned', this.rewards.totalEarned)
      },
    },
    setup(props) {
      const rewards = ref({})

      const getRewards = () => {
        rewards.value = new GameRewards(props.game)
      }

      return { rewards, getRewards }
    },
  }
</script>
