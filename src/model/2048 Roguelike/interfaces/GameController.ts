import IGameController from '@/model/2048 Standard/interfaces/GameController'
import { IInventory, IInventorySnapshot } from '@/model/Game Utils/Inventory'
import { IItem } from '@/model/Game Utils/Item/Item'
import { IRoguelikeGameProgress } from '@/model/Game Utils/SaveFile/interfaces/GameProgress'

export default interface IRoguelikeGameController extends IGameController {
  run: number
  inventory?: IInventory
  inventorySnapshot?: IInventorySnapshot
  bestRun: IRoguelikeGameProgress
  activeItem?: IItem
}
