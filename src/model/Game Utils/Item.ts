import { Consumable } from "./ConsumableItem"

export const enum ItemType {
    Unknown = '',
    Regular = 'regular',
    Base2 = 'block',
}

export interface IItemConfig {
    id: string
    name: string
    baseValue?: number
    quantity?: number
    capacity: number
    prices?: number[]
    defaultPrice?: number
    icon?: string
    type?: ItemType
}

export interface IItem extends IItemConfig {
    id: string,
    baseValue: number
    value: number
    quantity: number
    capacity: number
    percentageFull: number
    prices: number[]
    currentPrice: number
    defaultPrice?: number
    icon: string
    type: ItemType

    getQuantityValue: (amount: number) => number
    add: (qt: number) => void
    setValue: (value: number) => void
}

export default class Item implements IItem {
    protected _id
    private _type
    private _icon
    private _prices

    name
    quantity
    capacity
    baseValue
    defaultPrice

    get id() {
        return this._id
    }

    get type() {
        return this._type
    }

    get icon() {
        return this._icon
    }

    get prices() {
        return [...this._prices]
    }


    get percentageFull() {
        return 100 * (this.quantity / this.capacity)
    }

    get currentPrice() {
        if (this._prices[this.quantity] != undefined) return this._prices[this.quantity]
        if (this.defaultPrice != undefined) return this.defaultPrice as number
        return this._prices[this._prices.length - 1]
    }

    get value() {
        return this.getQuantityValue(this.quantity)
    }

    get nextValue() {
        return this.getQuantityValue(this.quantity + 1)
    }

    getQuantityValue(quantity: number) {
        return quantity
    };

    add(qt: number = 1) {
        this.quantity += qt
    }

    setValue(value: number) {
        this.quantity = value
    }

    constructor({
        id,
        name,
        defaultPrice,
        icon = 'fas fa-box',
        prices = [],
        quantity = 0,
        capacity = 0,
        baseValue = 0,
        type = ItemType.Unknown
    }: IItemConfig) {
        this._id = id
        this._icon = icon
        this._type = type
        this._prices = prices
        this.name = name
        this.quantity = quantity
        this.capacity = capacity
        this.baseValue = baseValue
        this.defaultPrice = defaultPrice
    }
}

export class RegularItem extends Item {
    getValue(amount: number) {
        return this.baseValue + amount
    }

    setValue(value: number) {
        this.quantity = value - this.baseValue
    }

    constructor(config: IItemConfig) {
        super({ ...config, type: ItemType.Regular })
    }
}

export class Base2Item extends Item {
    getValue(amount: number) {
        const baseLog = Math.log2(this.baseValue)
        return 2 ** (baseLog + amount)
    }

    setValue(value: number): void {
        const baseLog = Math.log2(this.baseValue)
        this.quantity = Math.log2(this.quantity) - baseLog
    }

    constructor(config: IItemConfig) {
        super({ ...config, type: ItemType.Base2 })
    }
}