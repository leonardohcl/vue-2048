import UpgradeItem, { IUpgradeItemConfig, Upgrade } from "./Upgrade"

export default class HeightUpgrade extends UpgradeItem {
    constructor({
        id = Upgrade.Height,
        name = "Height",
        startingValue = 3,
        maxUses = 5,
        priceProgression = [150, 350, 600, 750, 900],
        price = 900,
        icon = "fas fa-arrows-up-down"
    } = {}) {
        super({ id, name, startingValue, maxUses, priceProgression, price, icon })
    }
}