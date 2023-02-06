import GameController from '@/model/2048 Standard/GameController'
import { IGameSettings } from '../../SaveFile/interfaces/GameSettings'
import LimitedUseItem, {
  ILimitedUseItem,
  ILimitedUseItemConfig,
} from '../LimitedUseItem'

export const enum Upgrade {
  WinningBlock = 'winningBlock',
  Width = 'width',
  Height = 'height',
  MemoryCapacity = 'historySize',
}

export interface IUpgradeItemConfig extends ILimitedUseItemConfig {
  id: Upgrade
  startingValue?: number
  currentValue?: number
  priceProgression?: number[]
}

export interface IUpgradeItem extends ILimitedUseItem {
  nextValue: number
  currentValue: number
  startingValue?: number
  priceProgression?: number[]
}

export default class UpgradeItem
  extends LimitedUseItem
  implements IUpgradeItem
{
  private _startingValue: number
  private _priceProgression: number[]

  get price() {
    if (this._priceProgression[this.quantity])
      return this._priceProgression[this.quantity]
    return super.price
  }

  get currentValue() {
    return this.getValue(this._quantity)
  }

  get startingValue() {
    return this._startingValue
  }

  get nextValue() {
    return this.getValue(this.quantity + 1)
  }

  protected getValue(quantity = this.quantity) {
    return this._startingValue + quantity
  }

  protected apply(game: GameController): void {
    game.updateSettings({ [this._id]: this.nextValue } as IGameSettings)
  }

  setValue(value: number) {
    this._quantity = value - this.startingValue
  }

  constructor(config: IUpgradeItemConfig) {
    super({ ...config, id: config.id })
    this._startingValue = config.startingValue ?? 0
    this._priceProgression = config.priceProgression ?? []
  }
}
