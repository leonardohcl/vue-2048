import Game from "@/model/2048/Game"

export interface IItemConfig {
    id: string
    name: string
    icon?: string
    price?: number
    quantity?: number
    capacity?: number
}

export interface IItem extends IItemConfig {
    id: string,
    price: number
    icon: string
    quantity?: number
    capacity?: number
    percentageFull: number
}


export default class Item implements IItem {
    protected _id
    protected _price
    protected _quantity
    private _icon
    private _capacity

    name

    get id() {
        return this._id
    }

    get icon() {
        return this._icon
    }

    get quantity() { return this._quantity }
    get capacity() { return this._capacity }
    get percentageFull() {
        return this.capacity ? 100 * (this._quantity / this._capacity) : 0
    }


    get price() {
        return this._price
    }

    add(amount: number = 1) {
        this._quantity += amount
    }

    remove(amount: number = 1) {
        this._quantity -= amount
    }

    prepareUse(game: Game) { }

    constructor({
        id,
        name,
        quantity = 0,
        capacity = 0,
        price = 0,
        icon = 'fas fa-box',
    }: IItemConfig) {
        this._id = id
        this._icon = icon
        this._price = price
        this._quantity = quantity
        this._capacity = capacity
        this.name = name
    }
}

export class MissingItemError extends Error {
    constructor(id: string) {
        super(`MissingItemError: not enough items of id ${id} availble to use.`)
    }
} 