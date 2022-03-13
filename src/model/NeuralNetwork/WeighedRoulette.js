import {
    sum
} from "../../utils/array"

export default class WeightedRoulette {
    constructor(weights) {
        this._weights = weights
        const weightSum = sum(this._weights) || 1
        this._roulette = this._weights.map(x => x / weightSum)

    }

    getIndex() {
        const roll = Math.random();
        let acc = 0,
            idx = 0;
        do {
            acc += this._roulette[idx];
            idx++;
        } while (acc < roll && idx < this._roulette.length)

        return idx - 1;
    }
}