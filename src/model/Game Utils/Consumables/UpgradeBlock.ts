import Square from "@/model/2048/Square"
import ConsumableItem, { Consumable } from "../ConsumableItem"

export class UpgradeBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    protected use([square]: Square[]) {
        square.setValue(square.value * 2)
    }

    constructor({
        name = 'Upgrade Block',
        defaultPrice = 240,
        icon = 'fas fa-square-plus',
        prices = [],
        quantity = 0,
        capacity = 2,
        baseValue = 0,
    } = {}) {
        super({
            id: Consumable.UpgradeBlock,
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