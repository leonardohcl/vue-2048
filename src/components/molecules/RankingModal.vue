<template>
  <b-modal :id="id" centered title="Ranking" class="ranking-modal" hide-footer>
    <table
      class="ranking-modal--table table table-borderless table-sm table-striped"
      v-if="ranking.length > 0"
    >
      <thead>
        <tr>
          <td></td>
          <td>Score</td>
          <td>Moves</td>
          <td>Undos</td>
          <td>Highest Block</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, idx) in ranking" :key="idx">
          <td class="truncated-field text-right">{{ entry.name }}</td>
          <td>{{ entry.score }}</td>
          <td>{{ entry.moves }}</td>
          <td>{{ entry.undos }}</td>
          <td>
            <Square
              class="ranking-modal--square"
              :data="{ value: entry.block }"
              inline
            />
          </td>
        </tr>
        <tr v-for="idx in 10 - ranking.length" :key="idx">
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Square class="ranking-modal--square" :data="{ value: 0 }" inline />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center font-italic">No rankings saved yet</div>
  </b-modal>
</template>

<script>
  import Square from '@/components/atoms/Square.vue'
  import { useStore } from 'vuex'
  import { computed } from 'vue'

  export default {
    components: { Square },
    props: {
      id: { type: String, required: true },
      rankingId: { type: String, required: true },
    },
    setup(props) {
      const store = useStore()

      const ranking = computed(() => store.getters.ranking(props.rankingId))

      return { ranking }
    },
  }
</script>

<style lang="scss" scoped>
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
