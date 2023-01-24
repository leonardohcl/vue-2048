import BreakBlock from '../items/BreakBlock'
import { IItem } from '../items/Item'
import MoveBlock from '../items/MoveBlock'
import ShrinkBlock from '../items/ShrinkBlock'
import UpgradeBlock from '../items/UpgradeBlock'

export interface IIventoryItem {
  id: string
  name: string
  icon: string
  max: number
  blocksRequired: number
  price: number
  type: IItem
}

export interface IInventory {
  coins: number
  breakBlock: number
  upgradeBlock: number
  shrinkBlock: number
  moveBlock: number
}

export default class Inventory implements IInventory {
  breakBlock = 0
  upgradeBlock = 0
  shrinkBlock = 0
  moveBlock = 0
  coins = 0

  /**
   * These prices take in consideration an average of 20 coins
   * per run in the early game and 40 coins in the late game
   **/
  static availableItems: IIventoryItem[] = [
    {
      id: 'breakBlock',
      name: 'Break Block',
      icon: 'hammer',
      max: 3,
      blocksRequired: 1,
      price: 40,
      type: new BreakBlock(),
    },
    {
      id: 'upgradeBlock',
      name: 'Upgrade Block',
      icon: 'square-plus',
      max: 2,
      blocksRequired: 1,
      price: 240,
      type: new UpgradeBlock(),
    },
    {
      id: 'shrinkBlock',
      name: 'Shrink Block',
      icon: 'square-minus',
      max: 5,
      blocksRequired: 1,
      price: 80,
      type: new ShrinkBlock(),
    },
    {
      id: 'moveBlock',
      name: 'Move Block',
      icon: 'hand',
      max: 3,
      blocksRequired: 2,
      price: 400,
      type: new MoveBlock(),
    },
  ]
}
