import Matrix from "./Matrix";

const sum = arr => arr.reduce((acc, next) => acc + next, 0)

const batchNormaliztion = batch => {
    const mean = sum(batch) / batch.length
    const stdVar = Math.sqrt(
        sum(batch.map(x => (x - mean) * (x - mean))) / batch.length
    )
    return batch.map(x => (x - mean) / (stdVar + 1))
}
export default class Layer {
    constructor(inputSize, outputSize, useBias = true, useBatchNormalization = true, randomWeights = true) {
        this.inputSize = inputSize;
        this.outputsize = outputSize;
        this.useBias = useBias;
        this.useBatchNormalization = useBatchNormalization;
        this.bias = useBias ? (
            randomWeights ?
            Matrix.random(1, outputSize) :
            Matrix.zeros(1, outputSize)
        ) : null
        this.weights = randomWeights ?
            Matrix.random(inputSize, outputSize) :
            Matrix.zeros(inputSize, outputSize)

    }

    processInput(input) {
        let output = Matrix.multiply(input, this.weights)
        if (this.useBias) output = Matrix.add(output, this.bias)
        if (this.useBatchNormalization) output = [batchNormaliztion(output[0])]
        return output;
    }    
}