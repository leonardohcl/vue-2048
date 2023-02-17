import Square from '@/model/2048/Square'
import ConsumableItem, {
  Consumable,
  IConsumableItemConfig,
} from '../ConsumableItem'
import { SquareConsumableMeta } from '../interfaces/Square'

export class UpgradeBlock extends ConsumableItem {
  squareIsValid(sqr: Square): boolean {
    return sqr.value > 0
  }

  protected async use([square]: Square[]): Promise<void> {
    this.clearSquaresSelected()
    square.setValue(square.value * 2)
    square.setMeta(SquareConsumableMeta.Shrunk, false)
    square.setMeta(SquareConsumableMeta.Upgraded, true)
  }

  constructor({
    name = 'Upgrade',
    price = 240,
    icon = 'fas fa-square-plus',
    quantity = 0,
    capacity = 2,
  } = {}) {
    super({
      id: Consumable.UpgradeBlock,
      squaresRequired: 1,
      name,
      icon,
      price,
      quantity,
      capacity,
    })
  }
}
