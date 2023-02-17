import { SquareStateMeta } from '@/model/2048/interfaces/Square'
import Square from '@/model/2048/Square'
import ConsumableItem, { Consumable } from '../ConsumableItem'

export class FreezeBlock extends ConsumableItem {
  squareIsValid(sqr: Square): boolean {
    return sqr.value > 0
  }

  protected async use([square]: Square[]) {
    console.log('lock')
    square.setMeta(SquareStateMeta.Locked, true)
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
