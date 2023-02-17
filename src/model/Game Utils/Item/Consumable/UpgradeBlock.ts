import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable, IConsumableItemConfig } from "../ConsumableItem"

export class UpgradeBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    protected async use([square]: Square[]) {
        square.setValue(square.value * 2)
    }

    constructor({
        name = 'Upgrade',
        price = 240,
        icon = 'fas fa-square-plus',
        quantity = 0,
        capacity = 2,
    } = {}) {
        super({
            id: Consumable.UpgradeBlock,
            squaresRequired: 1,
            name,
            icon,
            price,
            quantity,
            capacity,
        })
    }
}