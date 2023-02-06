//#region Imports
import GameController from '@/model/2048 Standard/GameController'
import ConsumableItem, {
  Consumable,
} from '@/model/Game Utils/Item/ConsumableItem'
import { SquareConsumableMeta } from '@/model/Game Utils/Item/interfaces/Square'
import Inventory from '../Game Utils/Inventory'
import IRoguelikeGameController from './interfaces/GameController'
import RoguelikeRankingEntry from './RankingEntry'
import Square from '@/model/2048/Square'
import GameRewards from './GameRewards'
import Item from '@/model/Game Utils/Item/Item'
import RoguelikeSaveFile from '../Game Utils/SaveFile/RoguelikeSaveFile'
import { IRoguelikeGameProgress } from '../Game Utils/SaveFile/interfaces/GameProgress'
//#endregion
export default class RoguelikeGameController
  extends GameController
  implements IRoguelikeGameController
{
  //#region Attributes

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

  get rewards() {
    return this.winner || this.gameOver
      ? GameRewards.calculate(this)
      : undefined
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
    this._activeItem = undefined
    this.clearConsumableMeta()
  }

  deactivateItem() {
    this._activeItem = undefined
    this.clearConsumableMeta()
  }

  selectSquare(sqr: Square) {
    if (!this._activeItem) throw new EmptyActiveItemError()

    if (!(this._activeItem instanceof ConsumableItem))
      throw new ActiveItemIsNotConsumable(this._activeItem)

    this._activeItem.selectSquare(sqr)

    if (!this._activeItem.canConsume) {
      this._activeItem.prepareUse(this)
      return
    }

    this._activeItem.consume()
    this.deactivateItem()
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

  activateEndless() {
    throw new Error("Roguelike mode can't be set as endless")
  }

  updateGameState() {
    super.updateGameState()

    if (this.gameOver || this.winner) {
      if (this.rewards) this.inventory.wallet.add(this.rewards.totalEarned)
    }
  }

  processRunPerfomance() {
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

  //#region Memory
  getSnapshot(): IRoguelikeGameController {
    const game = super.getSnapshot()
    return {
      ...game,
      run: this._run,
      bestRun: this.bestRun,
      inventorySnapshot: this.inventory.getSnapshot(),
    }
  }

  getSaveFile() {
    return new RoguelikeSaveFile(this.getSnapshot())
  }

  load(save: RoguelikeSaveFile) {
    this.reset()
    super.load(save)
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
  getRankingEntry() {
    const entry = super.getRankingEntry() as RoguelikeRankingEntry

    entry.score = this.bestRun.score
    entry.block = this.bestRun.highestBlock
    entry.run = this.bestRun.run
    entry.moves = this.bestRun.moves
    entry.undos = this.bestRun.undos

    return entry
  }
  //#endregion
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
