import SaveFile from '@/model/2048/SaveFile'
import GameMode from '@/model/GameMode'
import RoguelikeSaveFile from '@/model/roguelike/RogueSaveFile'

const LOCAL_STORAGE_KEY = 'v2048-memory'

export interface IDefaultMemoryCard<Type> {
  savedGames: Type[]
  lastGame: Type | null
}

export interface IMemoryCard {
  regular: IDefaultMemoryCard<SaveFile>
  roguelike: IDefaultMemoryCard<RoguelikeSaveFile>
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
    roguelike: {
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

      const roguelikeMemory = JSON.parse(
        localStorage.getItem(`${LOCAL_STORAGE_KEY}_roguelike`) || 'null'
      )

      if (roguelikeMemory) {
        state.roguelike.lastGame = RoguelikeSaveFile.fromString(
          roguelikeMemory.lastGame || ''
        )
        state.roguelike.savedGames = (roguelikeMemory.savedGames ?? []).map(
          (encoded: string) => RoguelikeSaveFile.fromString(encoded)
        )
      }
    },
    [SAVE_GAMES_MUTATION](state: IMemoryCard) {
      const { regular, roguelike } = state
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          lastGame: regular.lastGame ? regular.lastGame.toString() : null,
          savedGames: regular.savedGames.map((save) => save.toString()),
        })
      )
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}_roguelike`,
        JSON.stringify({
          lastGame: roguelike.lastGame ? roguelike.lastGame.toString() : null,
          savedGames: roguelike.savedGames.map((save) => save.toString()),
        })
      )
    },
    [ADD_GAME_MUTATION](
      state: IMemoryCard,
      {
        save,
        gameMode = GameMode.Regular,
      }: { save: SaveFile | RoguelikeSaveFile; gameMode: GameMode }
    ) {
      const memoryFile =
        gameMode === GameMode.Regular
          ? (state[gameMode] as IDefaultMemoryCard<SaveFile>)
          : (state[gameMode] as IDefaultMemoryCard<RoguelikeSaveFile>)
      const idx = memoryFile.savedGames.findIndex(
        (entry: SaveFile | RoguelikeSaveFile) => entry.filename === save.filename
      )
      if (idx < 0) memoryFile.savedGames.push(save)
      else memoryFile.savedGames[idx] = save
    },
    [SAVE_LAST_GAME_MUTATION](
      state: IMemoryCard,
      { save, gameMode = GameMode.Regular }: { save: SaveFile; gameMode: GameMode }
    ) {
      const memoryFile = state[gameMode]
      memoryFile.lastGame = save
    },
  },
  actions: {
    [ADD_GAME_ACTION](
      context: { commit: Function },
      { save, gameMode = GameMode.Regular }: { save: SaveFile; gameMode: GameMode }
    ) {
      context.commit(ADD_GAME_MUTATION, { save, gameMode })
      context.commit(SAVE_GAMES_MUTATION)
    },
    [SAVE_LAST_GAME_ACTION](
      context: { commit: Function },
      { save, gameMode = GameMode.Regular }: { save: SaveFile; gameMode: GameMode }
    ) {
      context.commit(SAVE_LAST_GAME_MUTATION, { save, gameMode })
      context.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    saves(state: IMemoryCard) {
      return (gameMode: GameMode = GameMode.Regular) => state[gameMode].savedGames
    },
    lastGame(state: IMemoryCard) {
      return (gameMode: GameMode = GameMode.Regular) => state[gameMode].lastGame
    },
  },
}