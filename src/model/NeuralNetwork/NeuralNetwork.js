import Layer from "./Layer";
import Matrix from "./Matrix";

const softmax = arr => {
    const arrExpSum = arr.map(x => Math.exp(x)).reduce((acc, next) => acc + next, 0);
    return arr.map((x) => {
        if (arrExpSum == 0) return 0;
        return Math.exp(x) / arrExpSum
    })
}

export default class NeuralNetwork {
    constructor(layerSizes, useBias = true, useBatchNormalization = true) {
        this.layerSizes = layerSizes;
        this.useBias = useBias;

        const layers = new Array(layerSizes.length - 1).fill(0);
        this._layers =
            layers.map((x, idx) => new Layer(layerSizes[idx], layerSizes[idx + 1], useBias, useBatchNormalization))
    }

    processInput(input, useSoftmax) {
        const {
            m,
            n
        } = Matrix.shape(input)
        if (m !== 1 || n != this.layerSizes[0]) throw `Invalid input. Expects a Matrix of shape 1x${this.layerSizes[0]}, received ${m}x${n}`

        let result = input;
        this._layers.forEach(layer => {
            result = layer.processInput(result);
        })

        return useSoftmax ? [softmax(result[0])] : result;
    }
}