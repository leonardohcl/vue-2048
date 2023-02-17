import Square from '@/model/2048/Square'
import ConsumableItem, {
  Consumable,
  IConsumableItemConfig,
} from '../ConsumableItem'
import { SquareConsumableMeta } from '../interfaces/Square'

export class BreakBlock extends ConsumableItem {
  squareIsValid(sqr: Square): boolean {
    return sqr.value > 0
  }

  protected async use([square]: Square[]): Promise<void> {
    this.clearSquaresSelected()
    square.setMeta(SquareConsumableMeta.Broken, true)
    return new Promise((resolve) => {
      setTimeout(() => {
        square.setValue(0)
        resolve()
      }, 500)
    })
  }

  constructor({
    name = 'Break',
    price = 40,
    icon = 'fas fa-hammer',
    quantity = 0,
    capacity = 3,
  } = {}) {
    super({
      id: Consumable.BreakBlock,
      squaresRequired: 1,
      name,
      icon,
      price,
      quantity,
      capacity,
    })
  }
}
