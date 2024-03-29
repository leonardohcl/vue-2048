import Item from '@/model/Game utils/Item/Item'
import GameController from '../2048 Standard/GameController'
import Game from '../2048/Game'
import { BreakBlock } from './Item/Consumable/BreakBlock'
import { FreezeBlock } from './Item/Consumable/FreezeBlock'
import { MoveBlock } from './Item/Consumable/MoveBlock'
import { ShrinkBlock } from './Item/Consumable/ShrinkBlock'
import { UpgradeBlock } from './Item/Consumable/UpgradeBlock'
import ConsumableItem, { Consumable } from './Item/ConsumableItem'
import LimitedUseItem, { ILimitedUseItem } from './Item/LimitedUseItem'
import HeightUpgrade from './Item/Upgrade/Height'
import MemoryCapacityUpgrade from './Item/Upgrade/MemoryCapacity'
import UpgradeItem, { Upgrade } from './Item/Upgrade/Upgrade'
import WidthUpgrade from './Item/Upgrade/Width'
import WinningBlockUpgrade from './Item/Upgrade/WinningBlocks'
import RoguelikeSaveFile from './SaveFile/RoguelikeSaveFile'

//#region Wallet
export interface IWallet {
  coins?: number
}

export class Wallet implements IWallet {
  private _coins

  get coins() {
    return this._coins
  }

  canAfford(coins: number) {
    return coins <= this._coins
  }

  add(coins: number) {
    this._coins += coins
  }

  spend(coins: number) {
    if (!this.canAfford(coins)) throw new NotEnoughCreditsError()
    this._coins -= coins
  }

  defineBalance(coins: number) {
    this._coins = coins
  }

  constructor({ coins = 0 }: IWallet = {}) {
    this._coins = coins
  }
}
//#endregion

//#region Bag
export interface IBag {
  [key: string]: ConsumableItem
}
//#endregion
export interface IInventory {
  bag?: IBag
  wallet?: IWallet
  limitedUseItems?: { [key: string]: ILimitedUseItem }
}

export interface IInventorySnapshot {
  bag: { [key in Consumable]?: number }
  coins: number
}

export default class Inventory implements IInventory {
  bag: IBag = {}
  limitedUseItems: { [key: string]: LimitedUseItem } = {}
  wallet = new Wallet()
  constructor(game?: GameController) {
    this.reset()
    if (game) this.loadLimitedUseItemsPreset(game)
  }

  reset() {
    this.wallet.defineBalance(0)
    this.resetBag()
    this.resetLimitedUseItems()
  }

  resetBag() {
    this.bag = {
      [Consumable.BreakBlock]: new BreakBlock(),
      [Consumable.UpgradeBlock]: new UpgradeBlock(),
      [Consumable.ShrinkBlock]: new ShrinkBlock(),
      [Consumable.MoveBlock]: new MoveBlock(),
      [Consumable.FreezeBlock]: new FreezeBlock(),
    }
  }

  resetLimitedUseItems() {
    this.limitedUseItems = {
      [Upgrade.WinningBlock]: new WinningBlockUpgrade(),
      [Upgrade.Height]: new HeightUpgrade(),
      [Upgrade.Width]: new WidthUpgrade(),
      [Upgrade.MemoryCapacity]: new MemoryCapacityUpgrade(),
    }
  }

  load(file: RoguelikeSaveFile, game: GameController) {
    this.reset()
    this.loadLimitedUseItemsPreset(game)
    this.loadConsumables(file)
    this.wallet.defineBalance(file.inventory?.coins ?? 0)
  }

  loadConsumables(file: RoguelikeSaveFile) {
    this.bag[Consumable.BreakBlock]?.setQuantity(
      file.inventory.bag[Consumable.BreakBlock] ?? 0
    )
    this.bag[Consumable.UpgradeBlock]?.setQuantity(
      file.inventory.bag[Consumable.UpgradeBlock] ?? 0
    )
    this.bag[Consumable.ShrinkBlock]?.setQuantity(
      file.inventory.bag[Consumable.ShrinkBlock] ?? 0
    )
    this.bag[Consumable.MoveBlock]?.setQuantity(
      file.inventory.bag[Consumable.MoveBlock] ?? 0
    )
    this.bag[Consumable.FreezeBlock]?.setQuantity(
      file.inventory.bag[Consumable.FreezeBlock] ?? 0
    )
  }

  loadLimitedUseItemsPreset(game: GameController) {
    this.limitedUseItems[Upgrade.Width].setValue(game[Upgrade.Width])
    this.limitedUseItems[Upgrade.Height].setValue(game[Upgrade.Height])
    this.limitedUseItems[Upgrade.MemoryCapacity].setValue(
      game[Upgrade.MemoryCapacity]
    )
    this.limitedUseItems[Upgrade.WinningBlock].setValue(
      game[Upgrade.WinningBlock]
    )
  }

  buyItem(item: Item, game?: GameController) {
    if (item.quantity >= item.capacity)
      throw new InventoryCapacityOverflowError(item)

    this.wallet.spend(item.price)

    if (item instanceof ConsumableItem) {
      this.bag[item.id] = item
      item.add(1)
    } else if (item instanceof UpgradeItem) {
      this.limitedUseItems[item.id] = item
      item.use(game)
    }
  }

  getSnapshot(): IInventorySnapshot {
    return {
      bag: {
        [Consumable.BreakBlock]: this.bag[Consumable.BreakBlock].quantity,
        [Consumable.ShrinkBlock]: this.bag[Consumable.ShrinkBlock].quantity,
        [Consumable.MoveBlock]: this.bag[Consumable.MoveBlock].quantity,
        [Consumable.UpgradeBlock]: this.bag[Consumable.UpgradeBlock].quantity,
        [Consumable.FreezeBlock]: this.bag[Consumable.FreezeBlock].quantity,
      },
      coins: this.wallet.coins,
    }
  }
}

export class InventoryCapacityOverflowError extends Error {
  constructor(item: Item) {
    super(
      `InventoryCapacityOverflowError: Max capacity for the item (${item.capacity}) has been reached, can't buy another one"`
    )
  }
}

class NotEnoughCreditsError extends Error {
  constructor() {
    super(
      `NotEnoughCreditsError: not enough coins in the wallet to make purchase`
    )
  }
}
