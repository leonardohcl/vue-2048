import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable, IConsumableItemConfig } from "../ConsumableItem"

export class BreakBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    protected use([square]: Square[]) {
        square.setValue(0)
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
