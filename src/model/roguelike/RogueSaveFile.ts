import { IGameProgress } from '../2048/interfaces/GameProgress'
import GameSettings, { IGameSettings } from '../2048/interfaces/GameSettings'
import GameState, { IGameState } from '../2048/interfaces/GameState'
import SaveFile, { ISaveFile } from '../2048/SaveFile'
import RogueGameProgress, {
  IRogueGameProgress,
} from './interfaces/GameProgress'
import Inventory, { IInventory } from './Inventory'

export interface IRoguelikeSaveFile extends ISaveFile {
  inventory: Inventory
  progress: IRogueGameProgress
}

export default class RoguelikeSaveFile
  extends SaveFile
  implements IRoguelikeSaveFile
{
  inventory = new Inventory()
  progress: RogueGameProgress

  constructor(
    filename: string,
    settings: IGameSettings,
    state: IGameState,
    progress: IGameProgress | IRogueGameProgress,
    inventory: IInventory
  ) {
    super(filename, settings, state, progress)
    this.progress = new RogueGameProgress({ run: 0, bestScore: 0, ...progress })
    this.inventory = inventory
  }

  static fromString(str: string) {
    if (!str) return null
    const obj = JSON.parse(atob(str))
    return new RoguelikeSaveFile(
      obj.filename || '',
      obj.settings || new GameSettings(),
      obj.state || new GameState(),
      obj.progress || new RogueGameProgress(),
      obj.inventory || new Inventory()
    )
  }
}
