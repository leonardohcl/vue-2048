import LooseObject from '@/utils/LooseObject'
import RoguelikeSaveFile from './SaveFile/RoguelikeSaveFile'
import SaveFile from './SaveFile/SaveFile'
import GameMode from './GameMode'
import { deepCopy } from '../../utils/copy'

export const enum MemoryCardMode {
  Save = 'save',
  Load = 'load',
}

export const enum SlotName {
  LastGame = 'lastGame',
  Slot1 = 'slot1',
  Slot2 = 'slot2',
  Slot3 = 'slot3',
  Slot4 = 'slot4',
  Slot5 = 'slot5',
}

export const SLOTS_AVAILABLE = [
  SlotName.LastGame,
  SlotName.Slot1,
  SlotName.Slot2,
  SlotName.Slot3,
  SlotName.Slot4,
  SlotName.Slot5,
]

export interface IMemoryCard<T> {
  key: String
  slots: { [key in SlotName]?: T }
  lastGame?: T
}

export default class MemoryCard<T> implements IMemoryCard<T> {
  private _gameMode
  private _slots: { [key in SlotName]?: T } = {}

  get key() {
    return `v2048-memory__${this._gameMode}`
  }

  get gameMode() {
    return this._gameMode
  }
  get slots() {
    return { ...this._slots }
  }

  get lastGame() {
    return this._slots[SlotName.LastGame]
  }

  private loadSlots() {
    try {
      const encrypted = localStorage.getItem(this.key) ?? ''
      const decrypted = atob(encrypted)
      const memory = JSON.parse(decrypted || 'null')
      if (!memory) return

      SLOTS_AVAILABLE.forEach((slot) => {
        if (!memory[slot]) return

        const data = {
          ...memory[slot].settings,
          ...memory[slot].progress,
          ...memory[slot].state,
          bestRun: memory[slot].bestRun,
          inventorySnapshot: memory[slot].inventory,
        }

        this._slots[slot] =
          this.gameMode === GameMode.Roguelike
            ? (new RoguelikeSaveFile(data) as T)
            : (new SaveFile(data) as T)
      })
    } catch (err) {
      localStorage.removeItem(this.key)
      throw new CorruptedMemoryError()
    }
  }

  private encrypt(target: any) {
    return btoa(JSON.stringify(target))
  }

  private consolidateMemory() {
    const memoryCard: LooseObject = deepCopy(this.slots)
    localStorage.setItem(this.key, this.encrypt(memoryCard))
  }

  save(file: T, slot: SlotName) {
    this._slots[slot] = file
    this.consolidateMemory()
  }

  constructor(gameMode: GameMode) {
    this._gameMode = gameMode
    this.loadSlots()
  }
}

class CorruptedMemoryError extends Error {
  constructor() {
    super(
      `CorruptedMemoryError:couldn't read memory card, data corrupted or mismatching the ideal format`
    )
  }
}
