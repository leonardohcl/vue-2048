import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable } from "../ConsumableItem"

export class ShrinkBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 2
    }

    protected use([square]: Square[]) {
        square.setValue(square.value / 2)
    }

    constructor({
        name = "Shrink Block",
        defaultPrice = 80,
        icon = 'fas fa-square-minus',
        prices = [],
        quantity = 0,
        capacity = 6,
        baseValue = 0,
    } = {}) {
        super({
            id: Consumable.ShrinkBlock,
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
