import { IGameProgress } from '../2048/interfaces/GameProgress'
import GameSettings, { IGameSettings } from '../2048/interfaces/GameSettings'
import GameState, { IGameState } from '../2048/interfaces/GameState'
import SaveFile, { ISaveFile } from '../2048/SaveFile'
import RoguelikeGameProgress, {
  IRoguelikeGameProgress,
} from './interfaces/GameProgress'
import Inventory, { IInventory } from './Inventory'

export interface IRoguelikeSaveFile extends ISaveFile {
  inventory: Inventory
  progress: IRoguelikeGameProgress
  bestRun: IRoguelikeGameProgress
}

export default class RoguelikeSaveFile
  extends SaveFile
  implements IRoguelikeSaveFile
{
  inventory = new Inventory()
  progress: RoguelikeGameProgress
  bestRun

  constructor(
    filename: string,
    settings: IGameSettings,
    state: IGameState,
    progress: IGameProgress | IRoguelikeGameProgress,
    inventory: IInventory,
    bestRun: IRoguelikeGameProgress
  ) {
    super(filename, settings, state, progress)
    this.progress = new RoguelikeGameProgress({ run: 0, ...progress })
    this.inventory = inventory
    this.bestRun = bestRun
  }

  static fromString(str: string) {
    if (!str) return null
    const obj = JSON.parse(atob(str))
    return new RoguelikeSaveFile(
      obj.filename || '',
      obj.settings || new GameSettings(),
      obj.state || new GameState(),
      obj.progress || new RoguelikeGameProgress(),
      obj.inventory || new Inventory(),
      obj.bestRun || new GameState(),
    )
  }
}
