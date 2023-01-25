<template>
  <Btn
    v-if="useSubmit"
    :text="submitText"
    size="sm"
    theme="secondary"
    icon="award"
    outlined
    :disabled="disabled"
    @click="$emit('submitScore')"
  />
  <SaveScoreModal :id="`${id}-new-highscore`" :entry="entry" />
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import SaveScoreModal from '@/components/molecules/SaveScoreModal.vue'
  import GameController from '@/model/2048/GameController'
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: { SaveScoreModal, Btn },
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
        default: 'Submit Score',
      },
    },
    emits: ['submitScore'],
    methods: {
      saveScore(entry) {
        if (entry) this.entry = entry
        if (this.isRankingWorthy(entry.score))
          this.$bvModal.show(`${this.id}-new-highscore`)
      },
    },
    setup(props) {
      const entry = ref(
        GameController.getRankingEntry({
          rankingId: props.rankingId,
          game: props.game,
        })
      )

      const store = useStore()

      const ranking = computed(() => store.getters.ranking(props.rankingId))

      const highScores = computed(() => {
        if (ranking.value.length > 0)
          return {
            first: ranking.value[0].score,
            last: ranking.value[ranking.value.length - 1].score,
            count: ranking.value.length,
          }

        return {
          first: 0,
          last: 0,
          count: 0,
        }
      })

      const isRankingWorthy = (score) =>
        highScores.value.count < 10 || score > highScores.value.last

      return { entry, isRankingWorthy }
    },
  }
</script>
