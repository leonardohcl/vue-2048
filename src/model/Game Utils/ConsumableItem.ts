import Game from "../2048/Game";
import Square from "../2048/Square";
import { SquareConsumableMeta } from "./Consumables/interfaces/Square";
import { RegularItem, IItemConfig, IItem } from "./Item";

export const enum Consumable {
    Unknown = '',
    BreakBlock = "breakBlock",
    ShrinkBlock = "shrinkBlock",
    UpgradeBlock = "upgradeBlock",
    MoveBlock = "moveBlock",
}

export interface IConsumableItemConfig extends IItemConfig {
    blocksRequired?: number
}

export interface IConsumableItem extends IItem {
    blocksRequired: number,
    squareIsValid: (sqr: Square) => boolean
    prepareGame: (game: Game) => void
    consume: () => boolean
}

export default class ConsumableItem extends RegularItem implements IConsumableItem {
    private _blocksRequired

    protected _squaresSelected = new Array<Square>()

    get blocksRequired() {
        return this._blocksRequired
    }

    prepareGame(game: Game) {
        game.board.squares.forEach((sqr) =>
            sqr.setMeta(SquareConsumableMeta.Selectable, this.squareIsValid(sqr))
        )
    }

    selectSquare(square: Square) {
        if (!this.squareIsValid(square))
            throw new Error("ConsumableItem: the selected squares does not match the item criteria")

        this._squaresSelected.push(square)
        square.setMeta(SquareConsumableMeta.Selected, true)
    }

    protected use(squares: Square[]) { }

    get canConsume() {
        return this._squaresSelected.length != this._blocksRequired
    }

    consume() {
        if (!this.canConsume)
            throw new Error("ConsumableItem: not enough selected squares to consume item")

        this.use(this._squaresSelected)
        this.quantity--
        this._squaresSelected = []
        return true
    }

    squareIsValid(sqr: Square) { return sqr !== undefined };

    constructor(config: IConsumableItemConfig) {
        super({ ...config, id: Consumable.Unknown })
        this._blocksRequired = config.blocksRequired || 1
    }
}


