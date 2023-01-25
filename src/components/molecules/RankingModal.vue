<template>
  <b-modal
    :id="id"
    centered
    title="Ranking"
    class="ranking-modal"
    hide-footer
    scrollable
  >
    <RankingEntry
      v-for="(entry, idx) in ranking"
      :key="idx"
      :position="idx + 1"
      :entry="entry"
      :with-board="withBoard"
      :with-run="withRun"
    />
  </b-modal>
</template>

<script>
  import RankingEntry from '@/components/atoms/RankingEntry.vue'
  import { useStore } from 'vuex'
  import { computed } from 'vue'

  export default {
    components: { RankingEntry },
    props: {
      id: { type: String, required: true },
      rankingId: { type: String, required: true },
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
      const store = useStore()

      const ranking = computed(() => store.getters.ranking(props.rankingId))

      return { ranking }
    },
  }
</script>

<style lang="scss">
  .ranking-modal {
    &--table {
      max-width: 100%;
      text-align: center;
      thead {
        font-weight: bold;
      }

      .truncated-field {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 90px;
      }
    }

    &--square {
      margin: 0 auto;
    }
  }
</style>
