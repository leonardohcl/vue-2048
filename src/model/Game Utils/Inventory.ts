import ConsumableItem from "./ConsumableItem"

export interface IWallet {
  coins?: number
}

export class Wallet implements IWallet {
  private _coins

  get coins() {
    return this._coins
  }

  add(coins: number) {
    this._coins += coins
  }

  spend(coins: number) {
    if (coins > this._coins) throw Error("Wallet: Not enough coins to purchase")
    this._coins -= coins
  }

  defineBalance(coins: number) {
    this._coins = coins
  }

  constructor({ coins = 1000 }: IWallet) {
    this._coins = coins
  }
}

export interface IInventory {
  bag?: { [key: string]: number }
  wallet?: IWallet
}

export default class Inventory implements IInventory {
  bag
  wallet
  constructor({ bag = {}, wallet = {} }: IInventory = {}) {
    this.wallet = new Wallet(wallet)
    this.bag = bag
  }

  reset() {
    this.wallet.defineBalance(0)
    this.bag = {}
  }

  buyItem(item: ConsumableItem) {
    if (item.quantity >= item.capacity)
      throw new Error("Inventory: Max capacity for the item has been reached, can't buy another one")

    this.wallet.spend(item.currentPrice)
    item.quantity++
    this.bag[item.id] = item.quantity
  }
}
