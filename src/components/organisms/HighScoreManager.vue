<template>
  <SaveScoreModal :game="game" :id="`${id}-new-highscore`" />
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import SaveScoreModal from '@/components/molecules/SaveScoreModal.vue'
  export default {
    components: { SaveScoreModal },
    props: {
      game: {
        type: GameController,
        required: true,
      },
      id: {
        type: String,
        default: 'main-game',
      },
    },
    methods: {
      saveScore() {
        this.$bvModal.show(`${this.id}-new-highscore`)
      },
    },
  }
</script>
