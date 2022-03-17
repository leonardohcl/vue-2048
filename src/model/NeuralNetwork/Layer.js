import { batchNormaliztion } from "../../utils/array";
import Matrix from "./Matrix";

export default class Layer {
  #inputSize = 0;
  #outputSize = 0;
  #bias = null;
  #weights = null;
  constructor(
    inputSize,
    outputSize,
    useBias = true,
    useBatchNormalization = true,
    randomWeights = true
  ) {
    this.#inputSize = inputSize;
    this.#outputSize = outputSize;
    this.useBias = useBias;
    this.useBatchNormalization = useBatchNormalization;
    this.#bias = useBias
      ? randomWeights
        ? Matrix.random(1, outputSize)
        : Matrix.zeros(1, outputSize)
      : null;
    this.#weights = randomWeights
      ? Matrix.random(inputSize, outputSize)
      : Matrix.zeros(inputSize, outputSize);
  }

  get inputSize() {
    return this.#inputSize;
  }

  get outputSize() {
    return this.#outputSize;
  }

  get weights() {
    return Matrix.clone(this.#weights);
  }

  get bias() {
    return this.#bias;
  }

  processInput(input) {
    let output = Matrix.multiply(input, this.#weights);
    if (this.useBias) output = Matrix.add(output, this.#bias);
    if (this.useBatchNormalization) output = [batchNormaliztion(output[0])];
    return output;
  }

  loadWeights(weights) {
    if (!Matrix.hasSameShape(this.#weights, weights))
      throw "Can't load weights to layer. Received weights shape doesn't match layer weights";
    this.#weights = weights;
  }

  crossover(layer, crossoverPoint, mutationProbability = 0) {
    const weights = Matrix.crossover(
      this.#weights,
      layer.weights,
      crossoverPoint,
      mutationProbability
    );
    this.loadWeights(weights);

    if (this.useBias) {
      this.#bias = Matrix.crossover(
        this.#bias,
        layer.bias,
        crossoverPoint,
        mutationProbability
      );
    }
  }
}
