import { DefaultMemoryCard, SlotName, SLOT_NAMES } from '@/composables/memoryCard'
import SaveFile from '@/model/2048 Standard/SaveFile'
import GameMode, { GAME_MODES } from '@/model/Game Utils/GameMode'
import RoguelikeSaveFile from '@/model/2048 Roguelike/RogueSaveFile'
import LooseObject from '@/utils/LooseObject'

const LOCAL_STORAGE_KEY = (mode: GameMode) => `v2048-memory__${mode}`

const GAME_MODE_SAVE_TYPE = {
  [GameMode.Standard]: SaveFile,
  [GameMode.Roguelike]: RoguelikeSaveFile,
}

export interface IMemoryCardStore {
  [GameMode.Standard]: DefaultMemoryCard<SaveFile>
  [GameMode.Roguelike]: DefaultMemoryCard<RoguelikeSaveFile>
}

export const ADD_GAME_ACTION = 'ADD GAME ACTION'

export const LOAD_GAMES_MUTATION = 'LOAD GAMES MUTATION'
export const SAVE_GAMES_MUTATION = 'SAVE GAMES MUTATION'
export const ADD_GAME_MUTATION = 'ADD GAME MUTATION'
export const SAVE_LAST_GAME_MUTATION = 'SAVE LAST GAME MUTATION'

export default {
  state: {
    [GameMode.Standard]: {} as DefaultMemoryCard<SaveFile>,
    [GameMode.Roguelike]: {} as DefaultMemoryCard<RoguelikeSaveFile>
  },
  mutations: {
    [LOAD_GAMES_MUTATION](state: IMemoryCardStore) {
      GAME_MODES.forEach(mode => {
        try {
          const memory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY(mode)) || 'undefined')
          SLOT_NAMES.forEach(slot => {
            state[mode][slot] = GAME_MODE_SAVE_TYPE[mode].fromString(memory[slot])
          })
        }
        catch {
          throw new Error(`MemoryCardReader: couldn't load ${mode} memory card, data corrupted or mismatching the ideal format`)
        }
      })
    },
    [SAVE_GAMES_MUTATION](state: IMemoryCardStore) {
      GAME_MODES.forEach(mode => {
        const memoryCard: LooseObject<string | undefined> = {}
        SLOT_NAMES.forEach(slot => {
          memoryCard[slot] = state[mode][slot]?.toString()
        })
        localStorage.setItem(
          LOCAL_STORAGE_KEY(mode),
          JSON.stringify(memoryCard)
        )
      })
    },
    [ADD_GAME_MUTATION](
      state: IMemoryCardStore,
      { save, slot }: { save: SaveFile | RoguelikeSaveFile, slot: SlotName }
    ) {

      const gameMode = save instanceof RoguelikeSaveFile ? GameMode.Roguelike : GameMode.Standard
      const memoryFile = state[gameMode] as DefaultMemoryCard<typeof save>
      memoryFile[slot] = save
    },
  },
  actions: {
    [ADD_GAME_ACTION](
      context: { commit: Function },
      { save, slot }: { save: SaveFile | RoguelikeSaveFile, slot:SlotName }
    ) {
      context.commit(ADD_GAME_MUTATION, { save, slot })
      context.commit(SAVE_GAMES_MUTATION)
    },
  },
  getters: {
    slots(state: IMemoryCardStore) {
      return (gameMode: GameMode = GameMode.Standard) => state[gameMode]
    },
    lastGame(state: IMemoryCardStore) {
      return (gameMode: GameMode = GameMode.Standard) => state[gameMode][SlotName.LastGame]
    },
  },
}
