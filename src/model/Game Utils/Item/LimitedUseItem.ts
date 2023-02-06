import Item, { IItem, IItemConfig } from "./Item"

export interface ILimitedUseItemConfig extends IItemConfig {
    maxUses?: number
}

export interface ILimitedUseItem extends IItem {
    timesUsed: number
    maxUses: number
    use: (target: any) => void
}

export default class LimitedUseItem extends Item implements ILimitedUseItem {
    get timesUsed() {
        return this.quantity
    };

    get maxUses() {
        return this.capacity
    }

    protected apply(target: any) { }

    setValue(value:number) {
        this._quantity = value
    }

    use(target: any) {
        if (this.timesUsed >= this.maxUses)
            throw new OutOfUsesError(this)

        this.apply(target)
        this.add(1)
    }

    constructor(data: ILimitedUseItemConfig) {
        super({ ...data, capacity: data.maxUses })
    }
}

class OutOfUsesError extends Error {
    constructor(item: LimitedUseItem) {
        super(`OutOfUsesError: Item was already used the maximum times available (${item.maxUses})`)
    }
}