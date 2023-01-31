enum ItemType {
    Unknown = 'unk',
    Block = 'block',
    Number = 'number'
}

export interface IItemConfig {
    id: string
    name: string
    baseValue?: number
    amount?: number
    maxAmount: number
    prices?: number[]
    defaultPrice?: number
    icon?: string
    type?: ItemType
}

export interface IItem {
    id: string,
    baseValue: number
    amount: number
    maxAmount: number
    currentValue: number
    percentageFull: number
    prices: number[]
    currentPrice: number
    defaultPrice?: number
    icon?: string
    type: ItemType

    getValue: (amount: number) => number
    addAmount: (qt: number) => void
    setCurrentValue: (value: number) => void
}

export default class Item implements IItem {
    id = ''
    name = ''

    type
    icon
    prices
    amount
    maxAmount
    baseValue
    defaultPrice

    get percentageFull() {
        return 100 * (this.amount / this.maxAmount)
    }

    get currentPrice() {
        if (this.prices[this.amount] != undefined) return this.prices[this.amount]
        if (this.defaultPrice != undefined) return this.defaultPrice as number
        return this.prices[this.prices.length - 1]
    }

    get currentValue() {
        return this.getValue(this.amount)
    }

    get nextValue() {
        return this.getValue(this.amount + 1)
    }

    getValue(amount: number) {
        return amount
    };

    addAmount(qt: number = 1) {
        this.amount += qt
    }

    setCurrentValue(value: number) {
        this.amount = value
    }

    constructor({
        id,
        name,
        defaultPrice,
        icon = 'fas fa-box',
        prices = [],
        amount = 0,
        maxAmount = 0,
        baseValue = 0,
        type = ItemType.Unknown
    }: IItemConfig) {
        this.id = id
        this.name = name
        this.icon = icon
        this.prices = prices
        this.amount = amount
        this.maxAmount = maxAmount
        this.type = type
        this.baseValue = baseValue
        this.defaultPrice = defaultPrice
    }
}

export class NumberItem extends Item {
    type = ItemType.Number

    getValue(amount: number) {
        return this.baseValue + amount
    }

    setCurrentValue(value: number) {
        this.amount = value - this.baseValue
    }

    constructor(config: IItemConfig) {
        super({ ...config, type: ItemType.Number })
    }
}

export class BlockItem extends Item {
    type = ItemType.Block

    getValue(amount: number) {
        const baseLog = Math.log2(this.baseValue)
        return 2 ** (baseLog + amount)
    }

    setCurrentValue(value: number): void {
        const baseLog = Math.log2(this.baseValue)
        this.amount = Math.log2(value) - baseLog
    }

    constructor(config: IItemConfig) {
        super({ ...config, type: ItemType.Block })
    }
}