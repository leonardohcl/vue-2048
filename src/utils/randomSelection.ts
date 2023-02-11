export default function randomWeightedSelection<T>(elements: T[], weights: number[]) {
    if (elements.length !== weights.length) {
      throw new Error("The number of elements must be equal to the number of weights");
    }
    let filteredElements = elements.filter((_, i) => weights[i] !== 0);
    let filteredWeights = weights.filter(weight => weight !== 0);
    let totalWeight = filteredWeights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 0) {
      throw new Error("At least one weight must be larger than 0");
    }
    let randomValue = Math.random() * totalWeight;
    let weightSum = 0;
    for (let i = 0; i < filteredElements.length; i++) {
      weightSum += filteredWeights[i];
      if (randomValue <= weightSum) {
        return filteredElements[i];
      }
    }
  }
  