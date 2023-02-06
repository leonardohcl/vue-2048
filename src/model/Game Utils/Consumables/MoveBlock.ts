import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable } from "../ConsumableItem"

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
        defaultPrice = 400,
        icon = 'fas fa-hand',
        prices = [],
        quantity = 0,
        capacity = 3,
        baseValue = 0,
    } = {}) {
        super({
            id: Consumable.MoveBlock,
            blocksRequired: 2,
            name,
            defaultPrice,
            icon,
            prices,
            quantity,
            capacity,
            baseValue,
        })
    }
}
