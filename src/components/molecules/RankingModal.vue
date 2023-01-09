<template>
  <b-modal :id="id" centered title="Ranking" class="ranking-modal" hide-footer>
    <b-tabs pills v-model="activeTab" v-if="availableRankings.length">
      <b-tab
        v-for="shape in availableRankings"
        :key="shape.name"
        :title="shape.name"
      >
        <table
          class="ranking-modal--table table table-borderless table-sm table-striped"
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
            <tr v-for="(entry, idx) in shape.scores" :key="idx">
              <td class="truncated-field text-right">{{ entry.name }}</td>
              <td>{{ entry.score }}</td>
              <td>{{ entry.moves }}</td>
              <td>{{ entry.undos }}</td>
              <td>
                <Square
                  class="ranking-modal--square"
                  :data="{ value: entry.highestValue }"
                  inline
                />
              </td>
            </tr>
            <tr v-for="idx in 10 - shape.scores.length" :key="idx">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                <Square
                  class="ranking-modal--square"
                  :data="{ value: 0 }"
                  inline
                />
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
    </b-tabs>
    <div v-else class="text-center font-italic">No rankings saved yet</div>
  </b-modal>
</template>

<script>
  import Square from '@/components/atoms/Square.vue'
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: { Square },
    props: {
      id: { type: String, required: true },
    },
    setup() {
      const store = useStore()

      const availableRankings = computed(() => store.getters.availableRankings)
      
      const activeTab = ref(null)
      return { availableRankings, activeTab }
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

      .truncated-field{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 90px;
      }
    }
  }
</style>
