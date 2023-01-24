import SaveFile from '@/model/2048/SaveFile'
import GameMode from '@/model/GameMode'

const LOCAL_STORAGE_KEY = 'v2048-memory'

export interface IDefaultMemoryCard {
  savedGames: SaveFile[]
  lastGame: SaveFile | null
}

export interface IMemoryCard {
  regular: IDefaultMemoryCard
}

export const ADD_GAME_ACTION = 'ADD GAME ACTION'
export const SAVE_LAST_GAME_ACTION = 'SAVE LAST GAME ACTION'

export const LOAD_GAMES_MUTATION = 'LOAD GAMES MUTATION'
export const SAVE_GAMES_MUTATION = 'SAVE GAMES MUTATION'
export const ADD_GAME_MUTATION = 'ADD GAME MUTATION'
export const SAVE_LAST_GAME_MUTATION = 'SAVE LAST GAME MUTATION'

export default {
  state: {
    regular: {
      savedGames: [],
      lastGame: null,
    },
  },
  mutations: {
    [LOAD_GAMES_MUTATION](state: IMemoryCard) {
      const regularMemory = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || 'null'
      )

      if (regularMemory) {
        state.regular.lastGame = SaveFile.fromString(
          regularMemory.lastGame || ''
        )
        state.regular.savedGames = (regularMemory.savedGames ?? []).map(
          (encoded: string) => SaveFile.fromString(encoded)
        )
      }
    },
    [SAVE_GAMES_MUTATION](state: IMemoryCard) {
      const { regular } = state
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          lastGame: regular.lastGame ? regular.lastGame.toString() : null,
          savedGames: regular.savedGames.map((save) => save.toString()),
        })
      )
    },
    [ADD_GAME_MUTATION](
      state: IMemoryCard,
      save: SaveFile,
      gameMode: GameMode = 'regular'
    ) {
      const memoryFile = state[gameMode]
      const idx = memoryFile.savedGames.findIndex(
        (entry: SaveFile) => entry.filename === save.filename
      )
      if (idx < 0) memoryFile.savedGames.push(save)
      else memoryFile.savedGames[idx] = save
    },
    [SAVE_LAST_GAME_MUTATION](
      state: IMemoryCard,
      save: SaveFile,
      gameMode: GameMode = 'regular'
    ) {
      const memoryFile = state[gameMode]
      memoryFile.lastGame = save
    },
  },
  actions: {
    [ADD_GAME_ACTION](
      context: { commit: Function },
      save: SaveFile,
      gameMode: GameMode = 'regular'
    ) {
      context.commit(ADD_GAME_MUTATION, save)
      context.commit(SAVE_GAMES_MUTATION)
    },
    [SAVE_LAST_GAME_ACTION](
      context: { commit: Function },
      save: SaveFile,
      gameMode: GameMode = 'regular'
    ) {
      context.commit(SAVE_LAST_GAME_MUTATION, save)
      context.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    saves(state: IMemoryCard) {
      return (gameMode: GameMode = 'regular') => state[gameMode].savedGames
    },
    lastGame(state: IMemoryCard) {
      return (gameMode: GameMode = 'regular') => state[gameMode].lastGame
    },
  },
}
