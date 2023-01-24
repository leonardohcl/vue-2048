import { orderBy } from 'lodash'
import GameController from '@/model/2048/GameController'

export interface IRankingEntry {
  name: string
  score: number
  highestValue: number
  moves: number
  undos: number
}

export interface IRankingGroup {
  width: number
  height: number
  scores: IRankingEntry[]
}

export interface IRanking {
  rankings: IRankingGroup[]
}

const LOCAL_STORAGE_KEY = 'v2048-scores'
const MAXIMUM_RANKING_SIZE = 10

export const ADD_SCORE_ACTION = 'ADD SCORE ACTION'

export const SAVE_SCORE_MUTATION = 'SAVE SCORE MUTATION'
export const LOAD_SCORE_MUTATION = 'LOAD SCORE MUTATION'
export const ADD_SCORE_MUTATION = 'ADD SCORE MUTATION'

export default {
  state: {
    rankings: [],
  },
  getters: {
    availableRankings: (state: IRanking) => {
      return state.rankings.map((list) => ({
        name: `${list.width}x${list.height}`,
        width: list.width,
        height: list.height,
        scores: list.scores,
      }))
    },
  },
  mutations: {
    [LOAD_SCORE_MUTATION](state: IRanking) {
      state.rankings = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'
      )
    },
    [SAVE_SCORE_MUTATION](state: IRanking) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(orderBy(state.rankings, ['width', 'height']))
      )
    },
    [ADD_SCORE_MUTATION](
      state: IRanking,
      data: { name: string; game: GameController }
    ) {
      const { score, moves, undos, width, height } = data.game
      const highestValue = data.game.board.highestValue
      const entry = { name: data.name, score, highestValue, moves, undos }

      const existingIdx = state.rankings.findIndex(
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
    },
  },
  actions: {
    [ADD_SCORE_ACTION](
      context: { commit: Function },
      data: { name: string; game: GameController }
    ) {
      context.commit(ADD_SCORE_MUTATION, data)
      context.commit(SAVE_SCORE_MUTATION)
    },
  },
}
