import ConsumableItem from "../Game Utils/ConsumableItem"

export interface IWallet {
  coins?: number
}

export class Wallet implements IWallet {
  coins = 0
}

export interface IBag {
  breakBlock?: number
  upgradeBlock?: number
  shrinkBlock?: number
  moveBlock?: number
}

export class Bag implements IBag {
  [key: string]: number
  breakBlock = 0
  upgradeBlock = 0
  shrinkBlock = 0
  moveBlock = 0

  constructor({
    breakBlock = 0,
    upgradeBlock = 0,
    shrinkBlock = 0,
    moveBlock = 0 }: IBag = {
      breakBlock: 0,
      upgradeBlock: 0,
      shrinkBlock: 0,
      moveBlock: 0
    }) {
    this.breakBlock = breakBlock
    this.upgradeBlock = upgradeBlock
    this.shrinkBlock = shrinkBlock
    this.moveBlock = moveBlock
  }
}

export interface IInventory {
  bag: Bag
  wallet: Wallet
  activeItem?: ConsumableItem
}

export default class Inventory implements IInventory {
  bag = new Bag()
  wallet: Wallet = new Wallet()
  activeItem?: ConsumableItem
}
