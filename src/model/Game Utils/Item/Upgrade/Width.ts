import UpgradeItem, { IUpgradeItemConfig, Upgrade } from "./Upgrade"

export default class WidthUpgrade extends UpgradeItem {
    constructor({
        id = Upgrade.Width,
        name = "Width",
        startingValue = 3,
        maxUses = 5,
        priceProgression = [150, 350, 600, 750, 900],
        price = 900,
        icon = "fas fa-arrows-left-right"
    } = {}) {
        super({ id, name, startingValue, maxUses, priceProgression, price, icon })
    }
}