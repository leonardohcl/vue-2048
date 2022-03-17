import Robot from "./Robot";
import WeighedRoulette from "./WeighedRoulette"
import Game from "../2048/GameControllerLite";

const rest = async restTime =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, restTime);
  });

export default class RobotFactory {
  #population = [];
  #goatRobot = null;
  #goatScore = -Infinity;
  #bestRobot = null;
  #bestScore = -Infinity;
  #currentGeneration = 1;

  constructor(
    boardSize,
    brainStructure,
    populationSize,
    generationCount,
    mutationProbability,
    useElitism = true,
    restBetweenGenerations = 10
  ) {
    this.boardSize = boardSize;
    this.brainStructure = brainStructure;
    this.populationSize = populationSize;
    this.generationCount = generationCount;
    this.mutationProbability = mutationProbability;
    this.useElitism = useElitism;
    this.restBetweenGenerations = restBetweenGenerations;
    this.#population = new Array(this.populationSize)
      .fill(0)
      .map(() => new Robot(brainStructure, new Game(boardSize)));
  }

  get robot() {
    return this.#goatRobot;
  }

  async train(generationCallback = () => null) {
    while (this.#currentGeneration <= this.generationCount) {
      let bestRobotIndex = -1;

      // Get fitness
      const scores = this.#population.map((robot, idx) => {
        const score = robot.play();
        if (score > this.#bestScore) {
          bestRobotIndex = idx;
          this.#bestScore = score;
          this.#bestRobot = robot;

          if (score > this.#goatScore) {
            this.#goatRobot = robot;
            this.#goatScore = score;
          }
        }
        return score;
      });

      const roulette = new WeighedRoulette(scores);

      this.#population.forEach((robot, idx) => {
        if (this.useElitism && idx === bestRobotIndex) return;
        const breedingRobot = this.#population[roulette.getIndex()];
        const crossoverPoint = Math.random();
        robot.crossover(
          breedingRobot,
          crossoverPoint,
          this.mutationProbability
        );
      });

      generationCallback({
        bestScore: this.#bestScore,
        scores,
        generation: this.#currentGeneration,
        generationCount: this.generationCount,
      });

      this.#currentGeneration++;

      await rest(this.restBetweenGenerations);
    }
  }
}
