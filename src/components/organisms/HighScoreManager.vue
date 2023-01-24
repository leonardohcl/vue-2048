<template>
  <SaveScoreModal :id="`${id}-new-highscore`" :entry="entry" />
</template>

<script>
  import SaveScoreModal from '@/components/molecules/SaveScoreModal.vue'
  import GameController from '@/model/2048/GameController'
  import { ref } from 'vue'

  export default {
    components: { SaveScoreModal },
    props: {
      id: {
        type: String,
        default: 'main-game',
      },
      rankingId: {
        type: String,
        required: true,
      },
      game: {
        type: GameController,
        required: true,
      },
    },
    methods: {
      saveScore(entry) {
        if (entry) this.entry = entry
        this.$bvModal.show(`${this.id}-new-highscore`)
      },
    },
    setup(props) {
      const entry = ref(
        GameController.getRankingEntry(props.rankingId, '', props.game)
      )

      return { entry }
    },
  }
</script>
