<template>
  <b-modal
    :id="id"
    class="save-score-modal"
    title="New Score!"
    v-model="isOpen"
    centered
  >
    <form @submit.prevent="saveScore">
      <table
        class="table table-striped table-borderless table-sm w-100 text-center"
      >
        <tbody>
          <tr>
            <td>
              <b-form-input
                placeholder="Your name here"
                v-model="username"
                required
              />
            </td>
            <td>{{ entry.score }}</td>
            <td>{{ entry.moves }}</td>
            <td>{{ entry.undos }}</td>
            <td>
              <Square
                class="save-score-modal--square mx-auto"
                :data="{ value: entry.block }"
                inline
              />
            </td>
          </tr>
        </tbody>
        <button hidden type="submit" />
      </table>
    </form>
    <template v-slot:modal-footer>
      <Btn text="Cancel" outlined @click="isOpen = false" />
      <Btn text="Save" @click="saveScore" :disabled="!username" />
    </template>
  </b-modal>
</template>

<script>
  import { ref } from 'vue'
  import Square from '@/components/atoms/Square.vue'
  import { BFormInput } from 'bootstrap-vue'
  import { ADD_SCORE_ACTION } from '@/store/ranking'
  import { useStore } from 'vuex'
  import RoguelikeRankingEntry from '@/model/roguelike/RankingEntry'
  import RankinEntry from '@/model/2048/RankingEntry'
  import Btn from '@/components/atoms/Btn.vue'

  export default {
    components: { Square, BFormInput, Btn },
    props: {
      id: { type: String, required: true },
      entry: {
        type: [RankinEntry, RoguelikeRankingEntry],
        required: true,
      },
    },
    setup(props) {
      const isOpen = ref(false)
      const username = ref('')

      const store = useStore()

      const saveScore = () => {
        store.dispatch(ADD_SCORE_ACTION, {
          ...props.entry,
          name: username.value,
        })
        isOpen.value = false
      }

      return { username, isOpen, saveScore }
    },
  }
</script>
