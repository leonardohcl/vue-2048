import Game from "@/model/2048/Game";
import Square from "@/model/2048/Square";
import { SquareConsumableMeta } from "@/model/Game Utils/Item/interfaces/Square"
import Item, { IItemConfig, IItem, MissingItemError } from "./Item";

export const enum Consumable {
    BreakBlock = "breakBlock",
    ShrinkBlock = "shrinkBlock",
    UpgradeBlock = "upgradeBlock",
    MoveBlock = "moveBlock",
}

export interface IConsumableItemConfig extends IItemConfig {
    id: Consumable
    squaresRequired?: number
}

export interface IConsumableItem extends IItem {
    squaresRequired: number,
    squareIsValid: (sqr: Square) => boolean
    prepareUse: (game: Game) => void
    consume: () => boolean
}

export default class ConsumableItem extends Item implements IConsumableItem {
    private _squaresRequired

    protected _squaresSelected = new Array<Square>()

    get squaresRequired() {
        return this._squaresRequired
    }

    get canConsume() {
        return this._squaresSelected.length === this._squaresRequired
    }

    protected use(squares: Square[]) { }

    prepareUse(game: Game) {
        game.board.squares.forEach((sqr) =>
            sqr.setMeta(SquareConsumableMeta.Selectable, this.squareIsValid(sqr))
        )
    }

    selectSquare(square: Square) {
        if (!this.squareIsValid(square))
            throw new InvalidItemSquareError(square)

        if (this.canConsume) {
            throw new MaxSquareCapacityError()
        }

        this._squaresSelected.push(square)
        square.setMeta(SquareConsumableMeta.Selected, true)
    }


    consume() {
        if (this.quantity < 0)
            throw new MissingItemError(this.id)
        if (!this.canConsume)
            throw new MissingItemTargetError(this.id)

        this.use(this._squaresSelected)
        this.remove(1)
        this._squaresSelected = []
        return true
    }

    squareIsValid(sqr: Square) { return sqr !== undefined };

    constructor(config: IConsumableItemConfig) {
        super({ ...config})
        this._squaresRequired = config.squaresRequired ?? 1
    }
}


export class MissingItemTargetError extends Error {
    constructor(id: string) {
        super(`MissingItemTargetError: not enough selected squares to consume item ${id}.`)
    }
}

export class InvalidItemSquareError extends Error {
    constructor(sqr: Square) {
        super(`IvalidItemSquareError:the selected squares does not match the item criteria: ${sqr}.`)
    }
}

export class MaxSquareCapacityError extends Error {
    constructor() {
        super(`MaxSquareCapacityError: there are enough squares selected already, consume or cancel the item usage.`)
    }
}

