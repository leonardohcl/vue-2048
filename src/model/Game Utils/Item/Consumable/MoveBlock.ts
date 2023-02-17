import { SquareTrackingMeta } from '@/model/2048 Standard/interfaces/Square'
import Square from '@/model/2048/Square'
import ConsumableItem, { Consumable } from '../ConsumableItem'
import { SquareConsumableMeta } from '../interfaces/Square'

export class MoveBlock extends ConsumableItem {
  squareIsValid(sqr: Square): boolean {
    if (this._squaresSelected.length === 0) return true

    if (this._squaresSelected.some((existing) => existing === sqr)) return false
    if (
      sqr.value === 0 &&
      this._squaresSelected.some((exisitng) => exisitng.value === 0)
    )
      return false
    return true
  }

  protected async use([origin, destiny]: Square[]): Promise<void> {
    this.clearSquaresSelected()

    destiny.setMeta(SquareTrackingMeta.NextMove, {
      vertical: destiny.row - origin.row,
      horizontal: destiny.col - origin.col,
    })
    origin.setMeta(SquareTrackingMeta.NextMove, {
      vertical: origin.row - destiny.row,
      horizontal: origin.col - destiny.col,
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        destiny.setMeta(SquareTrackingMeta.NextMove, undefined)
        origin.setMeta(SquareTrackingMeta.NextMove, undefined)

        const aux = { value: destiny.value, meta: destiny.meta }

        destiny.setValue(origin.value)
        origin.setValue(aux.value)

        destiny.meta = origin.meta
        origin.meta = aux.meta

        resolve()
      }, 200)
    })
  }

  constructor({
    name = 'Move',
    price = 400,
    icon = 'fas fa-hand',
    quantity = 0,
    capacity = 3,
  } = {}) {
    super({
      id: Consumable.MoveBlock,
      squaresRequired: 2,
      name,
      icon,
      price,
      quantity,
      capacity,
    })
  }
}
