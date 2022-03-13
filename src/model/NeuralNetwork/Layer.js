import {
    batchNormaliztion
} from "../../utils/array";
import Matrix from "./Matrix";

export default class Layer {
    constructor(inputSize, outputSize, useBias = true, useBatchNormalization = true, randomWeights = true) {
        this._inputSize = inputSize;
        this._outputsize = outputSize;
        this.useBias = useBias;
        this.useBatchNormalization = useBatchNormalization;
        this._bias = useBias ? (
            randomWeights ?
            Matrix.random(1, outputSize) :
            Matrix.zeros(1, outputSize)
        ) : null
        this._weights = randomWeights ?
            Matrix.random(inputSize, outputSize) :
            Matrix.zeros(inputSize, outputSize)
    }

    get inputSize() {
        return this._inputSize;
    }

    get outputSize() {
        return this._outputsize;
    }

    get weights() {
        return this._weights
    }

    processInput(input) {
        let output = Matrix.multiply(input, this._weights)
        if (this.useBias) output = Matrix.add(output, this._bias)
        if (this.useBatchNormalization) output = [batchNormaliztion(output[0])]
        return output;
    }

    loadWeights(weights) {
        this._weights = weights
    }

    crossover(layer, crossoverPoint, mutationProbability = 0) {
        const weights = Matrix.crossover(this._weights, layer.weights, crossoverPoint, mutationProbability)
        this.loadWeights(weights);
    }
}