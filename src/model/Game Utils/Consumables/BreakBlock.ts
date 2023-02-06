import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable } from "../ConsumableItem"

export class BreakBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    protected use([square]: Square[]) {
        square.setValue(0)
    }

    constructor({
        name = 'Break Block',
        defaultPrice = 40,
        icon = 'fas fa-hammer',
        prices = [],
        quantity = 0,
        capacity = 3,
        baseValue = 0,
    } = {}) {
        super({
            id: Consumable.BreakBlock,
            blocksRequired: 1,
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
