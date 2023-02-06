import UpgradeItem, { IUpgradeItem, IUpgradeItemConfig, Upgrade } from "./Upgrade";

export default class WinningBlockUpgrade extends UpgradeItem {
    protected getValue(amount: number) {
        const baseLog = Math.log2(this.startingValue)
        return 2 ** (baseLog + amount)
    }

    setValue(value: number) {
        const baseLog = Math.log2(this.startingValue)
        const valueLog = Math.log2(value)
        this._quantity = valueLog - baseLog
    }

    constructor({
        id = Upgrade.WinningBlock,
        name = "Final Block",
        currentValue = undefined,
        startingValue = 64,
        maxUses = 7,
        priceProgression = [45, 175, 325, 415],
        price = 500
    } = {}) {
        super({ id, name, startingValue, maxUses, priceProgression, price })
        if (currentValue) this.setValue(currentValue)
    }
}