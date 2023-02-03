import SaveFile from '@/model/2048/SaveFile'
import GameMode from '@/model/GameMode'
import RoguelikeSaveFile from '@/model/roguelike/RogueSaveFile'

const LOCAL_STORAGE_KEY = (mode: GameMode) => `v2048-memory__${mode}`

const GAME_MODES = [GameMode.Standard, GameMode.Roguelike]
const GAME_MODE_SAVE_TYPE = {
  [GameMode.Standard]: SaveFile,
  [GameMode.Roguelike]: RoguelikeSaveFile,
}


export interface IDefaultMemoryCard<Type> {
  savedGames: Type[]
  lastGame: Type | null
}

export interface IMemoryCard {
  [GameMode.Standard]: IDefaultMemoryCard<SaveFile>
  [GameMode.Roguelike]: IDefaultMemoryCard<RoguelikeSaveFile>
}

export const ADD_GAME_ACTION = 'ADD GAME ACTION'
export const SAVE_LAST_GAME_ACTION = 'SAVE LAST GAME ACTION'

export const LOAD_GAMES_MUTATION = 'LOAD GAMES MUTATION'
export const SAVE_GAMES_MUTATION = 'SAVE GAMES MUTATION'
export const ADD_GAME_MUTATION = 'ADD GAME MUTATION'
export const SAVE_LAST_GAME_MUTATION = 'SAVE LAST GAME MUTATION'

export default {
  state: {
    [GameMode.Standard]: {
      savedGames: [],
      lastGame: null,
    },
    [GameMode.Roguelike]: {
      savedGames: [],
      lastGame: null,
    },
  },
  mutations: {
    [LOAD_GAMES_MUTATION](state: IMemoryCard) {
      GAME_MODES.forEach(mode => {
        const memory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY(mode)) || 'null')

        state[mode].lastGame = GAME_MODE_SAVE_TYPE[mode].fromString(
          memory?.lastGame ?? ''
        )
        state[mode].savedGames = memory?.savedGames?.map(
          (encoded: string) => GAME_MODE_SAVE_TYPE[mode].fromString(encoded)
        ) ?? []

      })
    },
    [SAVE_GAMES_MUTATION](state: IMemoryCard) {
      GAME_MODES.forEach(mode => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY(mode),
          JSON.stringify({
            lastGame: state[mode].lastGame?.toString(),
            savedGames: state[mode].savedGames.map((save) => save.toString()),
          })
        )
      })
    },
    [ADD_GAME_MUTATION](
      state: IMemoryCard,
      {
        save,
        gameMode = GameMode.Standard,
      }: { save: SaveFile | RoguelikeSaveFile; gameMode: GameMode }
    ) {
      const memoryFile =
        gameMode === GameMode.Standard
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
      { save, gameMode = GameMode.Standard }: { save: SaveFile; gameMode: GameMode }
    ) {
      const memoryFile = state[gameMode]
      memoryFile.lastGame = save
    },
  },
  actions: {
    [ADD_GAME_ACTION](
      context: { commit: Function },
      { save, gameMode = GameMode.Standard }: { save: SaveFile; gameMode: GameMode }
    ) {
      context.commit(ADD_GAME_MUTATION, { save, gameMode })
      context.commit(SAVE_GAMES_MUTATION)
    },
    [SAVE_LAST_GAME_ACTION](
      context: { commit: Function },
      { save, gameMode = GameMode.Standard }: { save: SaveFile; gameMode: GameMode }
    ) {
      context.commit(SAVE_LAST_GAME_MUTATION, { save, gameMode })
      context.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    saves(state: IMemoryCard) {
      return (gameMode: GameMode = GameMode.Standard) => state[gameMode].savedGames
    },
    lastGame(state: IMemoryCard) {
      return (gameMode: GameMode = GameMode.Standard) => state[gameMode].lastGame
    },
  },
}
