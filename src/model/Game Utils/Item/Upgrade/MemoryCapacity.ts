import UpgradeItem, { IUpgradeItemConfig, Upgrade } from "./Upgrade"

export default class MemoryCapacityUpgrade extends UpgradeItem {
    constructor({
        id = Upgrade.MemoryCapacity,
        name = "Memory",
        icon = "fas fa-brain",
        priceProgression = [500, 750, 750, 1000],
        price = 1000,
        maxUses = 5,
    } = {}) {
        super({ id, name, maxUses, priceProgression, price, icon })
    }
}