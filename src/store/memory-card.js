import SaveFile from '@/model/2048/SaveFile'
const LOCAL_STORAGE_KEY = 'v2048-memory'

export const LOAD_GAMES_MUTATION = 'LOAD GAMES'
export const SAVE_GAMES_MUTATION = 'SAVE GAMES'
export const ADD_GAME_MUTATION = 'ADD GAME'
export const SAVE_LAST_GAME_MUTATION = 'SAVE LAST GAME'

export default {
  state: {
    savedGames: [],
    lastGame: null,
  },
  mutations: {
    [LOAD_GAMES_MUTATION](state) {
      const memory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
        savedGames: [],
      }
      state.lastGame = SaveFile.fromString(memory.lastGame || '')
      state.savedGames = memory.savedGames.map((encoded) =>
        SaveFile.fromString(encoded)
      )
    },
    [SAVE_GAMES_MUTATION](state) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          lastGame: state.lastGame ? state.lastGame.toString() : null,
          savedGames: state.savedGames.map((save) => save.toString()),
        })
      )
    },
    [ADD_GAME_MUTATION](state, save) {
      const idx = state.savedGames.findIndex(
        (entry) => entry.filename === save.filename
      )
      if (idx < 0) state.savedGames.push(save)
      else state.savedGames[idx] = save

      this.commit(SAVE_GAMES_MUTATION)
    },
    [SAVE_LAST_GAME_MUTATION](state, save) {
      state.lastGame = save
      this.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    saves(state) {
      return state.savedGames
    },
    lastGame(state) {
      return state.lastGame
    },
  },
}
