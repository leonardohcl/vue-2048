import { SlotName } from "@/composables/memoryCard"
import GameSettings, { IGameSettings } from "../2048 Standard/partials/GameSettings"
import GameState, { IGameState } from "../2048 Standard/partials/GameState"
import SaveFile, { ISaveFile } from "../2048 Standard/SaveFile"
import Inventory, { IInventory } from "../Game Utils/Inventory"
import RoguelikeGameProgress, { IRoguelikeGameProgress } from "./interfaces/GameProgress"

export interface IRoguelikeSaveFile extends ISaveFile {
  inventory: IInventory
  progress: IRoguelikeGameProgress
  bestRun: IRoguelikeGameProgress
}

export default class RoguelikeSaveFile
  extends SaveFile
  implements IRoguelikeSaveFile {
  inventory
  progress
  bestRun

  constructor(
    settings: IGameSettings,
    state: IGameState,
    progress: IRoguelikeGameProgress,
    inventory: IInventory,
    bestRun: IRoguelikeGameProgress
  ) {
    super(settings, state, progress)
    this.progress = new RoguelikeGameProgress({ run: 0, ...progress })
    this.inventory = new Inventory(inventory)
    this.bestRun = bestRun
  }

  static fromString(str: string) {
    if (!str) return
    const obj = JSON.parse(atob(str))
    return new RoguelikeSaveFile(
      obj.filename || '',
      obj.settings || new GameSettings({}),
      obj.state || new GameState(),
      obj.progress || new RoguelikeGameProgress(),
      obj.inventory || new Inventory(),
    )
  }
}
