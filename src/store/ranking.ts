import { IRankingEntry } from '@/model/2048 Standard/RankingEntry'
import { IRoguelikeRankingEntry } from '@/model/2048 Roguelike/RankingEntry'

export interface IRankingDict {
  [key: string]: IRankingEntry[]
}

export interface IRanking {
  rankings: IRankingDict
}

const LOCAL_STORAGE_KEY = 'v2048-ranking'
const MAXIMUM_RANKING_SIZE = 10

export const ADD_SCORE_ACTION = 'ADD SCORE ACTION'

export const SAVE_SCORE_MUTATION = 'SAVE SCORE MUTATION'
export const LOAD_SCORE_MUTATION = 'LOAD SCORE MUTATION'
export const ADD_SCORE_MUTATION = 'ADD SCORE MUTATION'

export default {
  state: {
    rankings: {},
  },
  getters: {
    ranking: (state: IRanking) => (id: string) => {
      return state.rankings[id]
        ? state.rankings[id].sort((a, b) => b.score - a.score)
        : []
    },
  },
  mutations: {
    [LOAD_SCORE_MUTATION](state: IRanking) {
      const rankings = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'
      )
      state.rankings = rankings
    },
    [SAVE_SCORE_MUTATION](state: IRanking) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.rankings))
    },
    [ADD_SCORE_MUTATION](
      state: IRanking,
      entry: IRankingEntry | IRoguelikeRankingEntry
    ) {
      if (state.rankings[entry.id]) {
        state.rankings[entry.id].push(entry)
        state.rankings[entry.id]
          .sort((a, b) => b.score - a.score)
          .splice(MAXIMUM_RANKING_SIZE)
      } else {
        state.rankings[entry.id] = [entry]
      }
    },
  },
  actions: {
    [ADD_SCORE_ACTION](
      context: { commit: Function },
      entry: IRankingEntry | IRoguelikeRankingEntry
    ) {
      context.commit(ADD_SCORE_MUTATION, entry)
      context.commit(SAVE_SCORE_MUTATION)
    },
  },
}
