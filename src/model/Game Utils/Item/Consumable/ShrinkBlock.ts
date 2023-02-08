import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable, IConsumableItemConfig } from "../ConsumableItem"

export class ShrinkBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 2
    }

    protected use([square]: Square[]) {
        square.setValue(square.value / 2)
    }

    constructor({
        name = "Shrink",
        price = 80,
        icon = 'fas fa-square-minus',
        quantity = 0,
        capacity = 6,
    } = {}) {
        super({
            id: Consumable.ShrinkBlock,
            squaresRequired: 1,
            name,
            icon,
            price,
            quantity,
            capacity,
        })
    }
}
