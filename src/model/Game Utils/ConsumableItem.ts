import GameController from "../2048/GameController";
import Square from "../2048/Square";
import { NumberItem, IItemConfig, IItem } from "./Item";

export interface IConsumableItemConfig extends IItemConfig {
    blocksRequired?: number
}

export interface IConsumableItem extends IItem {
    blocksRequired: number,
    squaresSelected: Square[]
    squareIsValid: (sqr: Square) => boolean
    prepareGame: (game: GameController) => void
    use: (squares: Square[]) => void
    consume: () => boolean
}

export default class ConsumableItem extends NumberItem implements IConsumableItem {
    squaresSelected = new Array<Square>()

    blocksRequired

    prepareGame(game: GameController) {
        game.board.squares.forEach((sqr) =>
            sqr.customStates.selectable = this.squareIsValid(sqr)
        )
    }

    use(squares: Square[]) { }

    consume() {
        if (this.squaresSelected.length != this.blocksRequired) return false
        this.use(this.squaresSelected)
        this.amount--
        this.squaresSelected = []
        return true
    }

    squareIsValid(sqr: Square) { return true };

    constructor(config: IConsumableItemConfig) {
        super(config)
        this.blocksRequired = config.blocksRequired || 1
    }
}

export class BreakBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    use(squares: Square[]) {
        squares[0].value = 0
    }

    constructor({
        id = 'breakBlock',
        name = 'Break Block',
        defaultPrice = 40,
        icon = 'fas fa-hammer',
        prices = [],
        amount = 0,
        maxAmount = 3,
        baseValue = 0,
    } = { id: 'breakBlock', name: "breakBlock", maxAmount: 3 }) {
        super({
            id,
            name,
            defaultPrice,
            icon,
            prices,
            amount,
            maxAmount,
            baseValue,
            blocksRequired: 1
        })
    }
}

export class UpgradeBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 0
    }

    use(squares: Square[]) {
        squares[0].value *= 2
    }

    constructor({
        id = 'upgradeBlock',
        name = 'Upgrade Block',
        defaultPrice = 240,
        icon = 'fas fa-square-plus',
        prices = [],
        amount = 0,
        maxAmount = 2,
        baseValue = 0,
    } = { id: 'upgradeBlock', name: "Upgrade Block", maxAmount: 3 }) {
        super({
            id,
            name,
            defaultPrice,
            icon,
            prices,
            amount,
            maxAmount,
            baseValue,
            blocksRequired: 1
        })
    }
}

export class ShrinkBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        return sqr.value > 2
    }

    use(squares: Square[]) {
        squares[0].value /= 2
    }

    constructor({
        id = 'shrinkBlock',
        name = 'Shrink Block',
        defaultPrice = 80,
        icon = 'fas fa-square-minus',
        prices = [],
        amount = 0,
        maxAmount = 6,
        baseValue = 0,
    } = { id: 'shrinkBlock', name: "Shrink Block", maxAmount: 6 }) {
        super({
            id,
            name,
            defaultPrice,
            icon,
            prices,
            amount,
            maxAmount,
            baseValue,
            blocksRequired: 1
        })
    }
}

export class MoveBlock extends ConsumableItem {
    squareIsValid(sqr: Square): boolean {
        if (this.squaresSelected.length === 0) return true

        if (this.squaresSelected.some(existing => existing === sqr)) return false
        if (sqr.value === 0 && this.squaresSelected.some(exisitng => exisitng.value === 0)) return false
        return true
    }

    use(squares: Square[]) {
        const aux = squares[0].value
        squares[0].value = squares[1].value
        squares[1].value = aux
    }

    constructor({
        id = 'moveBlock',
        name = 'Move Block',
        defaultPrice = 400,
        icon = 'fas fa-hand',
        prices = [],
        amount = 0,
        maxAmount = 3,
        baseValue = 0,
    } = { id: 'moveBlock', name: "Move Block", maxAmount: 3 }) {
        super({
            id,
            name,
            defaultPrice,
            icon,
            prices,
            amount,
            maxAmount,
            baseValue,
            blocksRequired: 2
        })
    }
}
