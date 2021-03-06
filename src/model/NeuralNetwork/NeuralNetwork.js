import { softmax } from "../../utils/array";
import Layer from "./Layer";
import Matrix from "./Matrix";

export default class NeuralNetwork {
  #layers = [];
  #layerSizes = [];
  #useBias = true;

  constructor(layerSizes, useBias = true) {
    this.#layerSizes = layerSizes;
    this.#useBias = useBias;

    const layers = new Array(layerSizes.length - 1).fill(0);
    this.#layers = layers.map(
      (x, idx) => new Layer(layerSizes[idx], layerSizes[idx + 1], useBias)
    );
  }

  get layerCount() {
    return this.#layerSizes.length;
  }

  get layerSizes() {
    return [...this.layerSizes];
  }

  get layers() {
    return this.#layers;
  }

  get useBias() {
    return this.#useBias;
  }

  get weights() {
    return this.#layers.map(layer => layer.weights);
  }

  processInput(input, useSoftmax) {
    const { m, n } = Matrix.shape(input);
    if (m !== 1 || n != this.#layerSizes[0])
      throw `Invalid input. Expects a Matrix of shape 1x${
        this.#layerSizes[0]
      }, received ${m}x${n}`;

    let result = input;
    this.#layers.forEach(layer => {
      result = layer.processInput(result);
    });

    return useSoftmax ? [softmax(result[0])] : result;
  }

  crossover(net, crossoverPoint, mutationProbability = 0) {
    if (this.layerCount != net.layerCount)
      throw "Can't crossover networks with different structures";
    for (let i = 0; i < this.#layers.length; i++) {
      this.#layers[i].crossover(
        net.layers[i],
        crossoverPoint,
        mutationProbability
      );
    }
  }

  loadWeights(weights) {
    if (weights.length != this.#layers.length)
      throw "Can't load weights. Weight list received doesn't match NeuralNetwork structure.";

    this.#layers.forEach((layer, idx) => {
      layer.loadWeights(weights[idx]);
    });
  }
}
