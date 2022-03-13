import { softmax } from "../../utils/array";
import Layer from "./Layer";
import Matrix from "./Matrix";

export default class NeuralNetwork {
    constructor(layerSizes, useBias = true, useBatchNormalization = true) {
        this.layerSizes = layerSizes;
        this.useBias = useBias;

        const layers = new Array(layerSizes.length - 1).fill(0);
        this._layers =
            layers.map((x, idx) => new Layer(layerSizes[idx], layerSizes[idx + 1], useBias, useBatchNormalization))
    }

    get layerCount() {
        return this.layerSizes.length
    }

    get layers() {
        return this._layers
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

    crossover(net, crossoverPoint, mutationProbability = 0) {
        if (this.layerCount != net.layerCount) throw "Can't crossover networks with different structures"
        for (let i = 0; i < this._layers.length; i++) {
            this._layers[i].crossover(net.layers[i], crossoverPoint, mutationProbability)
        }
    }
}