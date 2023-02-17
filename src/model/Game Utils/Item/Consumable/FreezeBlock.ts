import Square from '@/model/2048/Square'
import ConsumableItem, { Consumable } from '../ConsumableItem'
import { SquareConsumableMeta } from '../interfaces/Square'

export class FreezeBlock extends ConsumableItem {
  squareIsValid(sqr: Square): boolean {
    return sqr.value > 0
  }

  protected async use([square]: Square[]) {
    square.setMeta(SquareConsumableMeta.Frozen, true)
  }

  constructor({
    name = 'Freeze',
    price = 15,
    icon = 'far fa-snowflake',
    quantity = 0,
    capacity = 3,
} = {}) {
    super({
        id: Consumable.FreezeBlock,
        squaresRequired: 1,
        name,
        icon,
        price,
        quantity,
        capacity,
    })
}
}
