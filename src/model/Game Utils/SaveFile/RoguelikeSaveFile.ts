import IRoguelikeGameController from '@/model/2048 Roguelike/interfaces/GameController'
import { IInventorySnapshot } from '../Inventory'
import { IRoguelikeGameProgress } from './interfaces/GameProgress'
import SaveFile, { ISaveFile } from './SaveFile'

export interface IRoguelikeSaveFile extends ISaveFile {
  inventory: IInventorySnapshot
  progress: IRoguelikeGameProgress
  bestRun: IRoguelikeGameProgress
}

export default class RoguelikeSaveFile
  extends SaveFile
  implements IRoguelikeSaveFile
{
  inventory: IInventorySnapshot
  progress: IRoguelikeGameProgress
  bestRun

  constructor(game: IRoguelikeGameController) {
    super(game)
    this.progress = { ...super.progress, run: 0 }
    this.bestRun = game.bestRun
    this.inventory = game.inventorySnapshot ?? { bag: {}, coins: 0 }
  }
}
