import { orderBy } from 'lodash'

const LOCAL_STORAGE_KEY = 'v2048-scores'
const MAXIMUM_RANKING_SIZE = 10

export const SAVE_SCORE_MUTATION = 'SAVE SCORE'
export const LOAD_SCORE_MUTATION = 'LOAD SCORE'
export const ADD_SCORE_MUTATION = 'ADD SCORE'

export default {
  state: {
    rankings: [],
  },
  getters: {
    availableRankings: (state) => {
      return state.rankings.map((list) => ({
        name: `${list.width}x${list.height}`,
        width: list.width,
        height: list.height,
        scores: list.scores,
      }))
    },
  },
  mutations: {
    [LOAD_SCORE_MUTATION](state) {
      state.rankings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
    },
    [SAVE_SCORE_MUTATION](state) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(orderBy(state.rankings, ['width', 'height']))
      )
    },
    [ADD_SCORE_MUTATION](state, data) {
      const { score, moves, undos, width, height } = data.game
      const highestValue = data.game.board.highestValue
      const entry = { name: data.name, score, highestValue, moves, undos }

      let existingIdx = state.rankings.findIndex(
        (list) => list.width === width && list.height === height
      )
      if (existingIdx >= 0) {
        const list = state.rankings[existingIdx].scores
        list.push(entry)
        list.sort((a, b) => b.score - a.score).splice(MAXIMUM_RANKING_SIZE)
      } else {
        const newList = { width, height, scores: [entry] }
        state.rankings.push(newList)
      }

      this.commit(SAVE_SCORE_MUTATION)
    },
  },
}
