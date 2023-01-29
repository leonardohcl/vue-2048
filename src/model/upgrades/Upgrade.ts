enum UpgradeType {
    Unknown = 'unk',
    Block = 'block',
    Number = 'number'
}

export default interface IUpgrade {
    id?: string,
    initialValue: number,
    currentValue: number,
    icon?: string,
    name: string,
    rank: number,
    maxRank: number,
    price: number[]
    defaultPrice: number,
    type: UpgradeType
    getNextValue(value: number): number

}

export class Upgrade implements IUpgrade {
    initialValue = 0;
    currentValue = 0
    rank = 0
    maxRank = 0
    defaultPrice = 0
    type = UpgradeType.Unknown
    name = ""
    price: number[] = []

    getNextValue(value: number): number {
        return value
    }

    updateRank() { }

    constructor() {
        this.currentValue = this.initialValue
    }
}

export class NumberUpgrade extends Upgrade {
    type = UpgradeType.Number
    getNextValue(value: number) {
        return value + 1
    }

    updateRank(): void {
        this.rank = this.currentValue - this.initialValue
    }
}

export class BlockUpgrade extends Upgrade {
    type = UpgradeType.Block
    getNextValue(value: number) {
        return value * 2
    }

    updateRank(): void {
        const initialLog = Math.log2(this.initialValue)
        this.rank = Math.log2(this.currentValue) - initialLog
    }
}

export class UpgradeWidth extends NumberUpgrade {
    id = "width"
    name = "Width"
    initialValue = 3
    maxRank = 5
    price = [150, 350, 600, 750, 900]
    icon = "fas fa-arrows-left-right"
}

export class UpgradeHeight extends NumberUpgrade {
    id = "height"
    name = "Height"
    initialValue = 3
    maxRank = 5
    price = [150, 350, 600, 750, 900]
    icon = "fas fa-arrows-up-down"
}

export class UpgradeHistorySize extends NumberUpgrade {
    id = "historySize"
    icon = "fas fa-brain"
    name = "Memory"
    price = [500, 750, 750, 1000, 1000]
    maxRank = 5
}

export class UpgradeWinningBlock extends BlockUpgrade {
    id = "winningBlock"
    name = "Final Block"
    initialValue = 64
    maxRank = 7
    price = [45, 175, 325, 415]
    defaultPrice = 500
}