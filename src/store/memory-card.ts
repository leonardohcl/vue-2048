import SaveFile from '@/model/2048/SaveFile'

const LOCAL_STORAGE_KEY = 'v2048-memory'

export interface IMemoryCard {
  savedGames: SaveFile[]
  lastGame: SaveFile | null
}

export const ADD_GAME_ACTION = 'ADD GAME ACTION'
export const SAVE_LAST_GAME_ACTION = 'SAVE LAST GAME ACTION'

export const LOAD_GAMES_MUTATION = 'LOAD GAMES MUTATION'
export const SAVE_GAMES_MUTATION = 'SAVE GAMES MUTATION'
export const ADD_GAME_MUTATION = 'ADD GAME MUTATION'
export const SAVE_LAST_GAME_MUTATION = 'SAVE LAST GAME MUTATION'

export default {
  state: {
    savedGames: [],
    lastGame: null,
  },
  mutations: {
    [LOAD_GAMES_MUTATION](state: IMemoryCard) {
      const memory = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '{"savedGames": []}'
      )

      state.lastGame = SaveFile.fromString(memory.lastGame || '')
      state.savedGames = memory.savedGames.map((encoded: string) =>
        SaveFile.fromString(encoded)
      )
    },
    [SAVE_GAMES_MUTATION](state: IMemoryCard) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          lastGame: state.lastGame ? state.lastGame.toString() : null,
          savedGames: state.savedGames.map((save) => save.toString()),
        })
      )
    },
    [ADD_GAME_MUTATION](state: IMemoryCard, save: SaveFile) {
      const idx = state.savedGames.findIndex(
        (entry) => entry.filename === save.filename
      )
      if (idx < 0) state.savedGames.push(save)
      else state.savedGames[idx] = save
    },
    [SAVE_LAST_GAME_MUTATION](state: IMemoryCard, save: SaveFile) {
      state.lastGame = save
    },
  },
  actions: {
    [ADD_GAME_ACTION](context: { commit: Function }, save: SaveFile) {
      context.commit(ADD_GAME_MUTATION, save)
      context.commit(SAVE_GAMES_MUTATION)
    },
    [SAVE_LAST_GAME_ACTION](context: { commit: Function }, save: SaveFile) {
      context.commit(SAVE_LAST_GAME_MUTATION, save)
      context.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    saves(state: IMemoryCard) {
      return state.savedGames
    },
    lastGame(state: IMemoryCard) {
      return state.lastGame
    },
  },
}
