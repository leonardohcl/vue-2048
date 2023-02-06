import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable, IConsumableItemConfig } from "../ConsumableItem"

export class MoveBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        if (this._squaresSelected.length === 0) return true

        if (this._squaresSelected.some(existing => existing === sqr)) return false
        if (sqr.value === 0 && this._squaresSelected.some(exisitng => exisitng.value === 0)) return false
        return true
    }

    protected use([origin, desitiny]: Square[]) {
        const aux = desitiny.value
        desitiny.setValue(origin.value)
        origin.setValue(aux)
    }

    constructor({
        name = 'Move Block',
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
