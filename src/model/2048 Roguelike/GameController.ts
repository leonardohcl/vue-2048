//#region Imports
import GameController from '@/model/2048 Standard/GameController'
import ConsumableItem, {
  Consumable,
} from '@/model/Game Utils/Item/ConsumableItem'
import { SquareConsumableMeta } from '@/model/Game Utils/Item/interfaces/Square'
import Inventory from '../Game Utils/Inventory'
import IRoguelikeGameController from './interfaces/GameController'
import Square from '@/model/2048/Square'
import GameRewards from './GameRewards'
import Item from '@/model/Game Utils/Item/Item'
import RoguelikeSaveFile from '../Game Utils/SaveFile/RoguelikeSaveFile'
import { IRoguelikeGameProgress } from '../Game Utils/SaveFile/interfaces/GameProgress'
import MemoryCard, { SlotName } from '../Game Utils/MemoryCard'
import GameMode from '../Game Utils/GameMode'
import LeaderboardEntry from '../Game Utils/Leaderboard/LeaderboardEntry'
//#endregion
export default class RoguelikeGameController
  extends GameController
  implements IRoguelikeGameController
{
  //#region Attributes
  protected _memoryCard: MemoryCard<RoguelikeSaveFile>

  private _run = 0
  private _inventory = new Inventory()
  private _bestRun: IRoguelikeGameProgress = {
    run: 0,
    score: 0,
    highestBlock: 0,
    moves: 0,
    undos: 0,
  }
  private _activeItem?: Item

  //#endregion

  //#region Getters
  get run() {
    return this._run
  }
  get inventory() {
    return this._inventory
  }
  get bestRun() {
    return this._bestRun
  }
  get activeItem() {
    return this._activeItem
  }
  get memoryCard() {
    return this._memoryCard
  }
  get leaderboardId() {
    return 'roguelike'
  }

  //#endregion

  //#region Item Usage

  private clearConsumableMeta() {
    this.board.squares.forEach((sqr) => {
      sqr.setMeta(SquareConsumableMeta.Selected, false)
      sqr.setMeta(SquareConsumableMeta.Selectable, false)
    })
  }

  private setActiveItem(item?: Item) {
    this._activeItem = item
  }

  activateItem(item: Item) {
    if (!this._inventory.bag[item.id])
      throw new Error(
        'GameController: not enough items in the inventory to use it'
      )
    this.setActiveItem(item)
    item.prepareUse(this)
  }

  cancelItem() {
    this.deactivateItem()
  }

  deactivateItem() {
    this._activeItem = undefined
    this.clearConsumableMeta()
  }

  async selectSquare(sqr: Square):Promise<boolean> {
    if (!this._activeItem) throw new EmptyActiveItemError()

    if (!(this._activeItem instanceof ConsumableItem))
      throw new ActiveItemIsNotConsumable(this._activeItem)

    this._activeItem.selectSquare(sqr)

    if (!this._activeItem.canConsume) {
      this._activeItem.prepareUse(this)
      return Promise.resolve(false)
    }

    await this._activeItem.consume()
    this.deactivateItem()
    this.updateGameState()
    this.saveCurrent()
    return Promise.resolve(true);
  }

  //#endregion

  //#region State
  reset() {
    super.reset()
    this._run = 0
    this._inventory.reset()
    this._bestRun = { run: 0, score: 0, highestBlock: 0, moves: 0, undos: 0 }
    this._activeItem = undefined
    this.updateSettings({
      width: 3,
      height: 3,
      historySize: 0,
      winningBlock: 64,
    })
  }

  start() {
    super.start()
    this._run++
  }

  endRun() {
    this._isRunning = false
    this.deactivateItem()
    this.updateBestRun()
    const rewards = this.getRewards()
    this.inventory.wallet.add(rewards?.totalEarned ?? 0)
    this.saveHighscore()
    this.saveCurrent()
  }

  activateEndless() {
    throw new Error("Roguelike mode can't be set as endless")
  }

  updateGameState() {
    super.updateGameState()

    if (!this.isRunning) {
      this.endRun()
    }
  }

  updateBestRun() {
    if (this._score <= this._bestRun.score) return
    this._bestRun = {
      score: this._score,
      highestBlock: this.highestBlock,
      moves: this._moves,
      run: this._run,
      undos: this._undos,
    }
  }

  //#endregion

  //#region Rewards
  getRewards() {
    return GameRewards.calculate(this) ?? new GameRewards([], 0)
  }
  //#endregion

  //#region Memory
  getSnapshot(): IRoguelikeGameController {
    const game = super.getSnapshot()
    const snapshot = {
      ...game,
      run: this._run,
      bestRun: this.bestRun,
      inventorySnapshot: this.inventory.getSnapshot(),
    }
    return snapshot
  }

  getSaveFile() {
    const file = new RoguelikeSaveFile(this.getSnapshot())
    return file
  }

  load(slotName: SlotName) {
    const save = this._memoryCard.slots[slotName]
    if (!save) return
    this.reset
    this.reset()
    super.load(slotName)
    this._run = save.progress.run
    this._bestRun = save.bestRun ?? {
      run: 0,
      score: 0,
      highestBlock: 0,
      moves: 0,
      undos: 0,
    }
    this.inventory.load(save, this)
    this._activeItem = undefined
  }
  //#endregion

  //#region Ranking
  getLeaderboardEntry() {
    const entry = new LeaderboardEntry({
      block: this.bestRun.highestBlock,
      width: this.width,
      height: this.height,
      moves: this._bestRun.moves,
      score: this._bestRun.score,
      undos: this._bestRun.undos,
      run: this._bestRun.run,
    })
    return entry
  }
  //#endregion

  constructor({
    width = 3,
    height = 3,
    winningBlock = 64,
    historySize = 0,
    updateDelay = 0,
  } = {}) {
    super({ width, height, winningBlock, historySize, updateDelay })
    this._memoryCard = new MemoryCard<RoguelikeSaveFile>(GameMode.Roguelike)
  }
}

//#region Errors
class EmptyActiveItemError extends Error {
  constructor() {
    super(`EmptyActiveItemError: can't select squares without an active item.`)
  }
}

class ActiveItemIsNotConsumable extends Error {
  constructor(item: Item) {
    super(
      `ActiveItemIsNotConsumable: item (${item.id}) is active but it's not consumable`
    )
  }
}
//#endregion
