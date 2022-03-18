import Robot from "./Robot";
import WeighedRoulette from "./WeighedRoulette";
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
  #currentGeneration = 0;
  #shouldStop = false;

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

  get score() {
    return this.#goatScore;
  }

  get currentGeneration() {
    return this.#currentGeneration;
  }

  get records() {
    const records = {
      boardSize: this.boardSize,
      brainStructure: this.brainStructure,
      populationSize: this.populationSize,
      generationCount: this.generationCount,
      currentGeneration: this.#currentGeneration,
      mutationProbability: this.mutationProbability,
      useElitism: this.useElitism,
      restBetweenGenerations: this.restBetweenGenerations,
      population: this.#population.map(robot => robot.synapses),
      goatRobot: this.#goatRobot.synapses,
      goatScore: this.#goatScore,
    };

    return JSON.stringify(records);
  }

  async train(
    generationCallback = () => null,
    shouldStopTraining = () => false
  ) {
    while (this.#currentGeneration < this.generationCount) {
      let bestRobotIndex = -1,
        bestScore = -Infinity;

      // Get fitness
      const scores = this.#population.map((robot, idx) => {
        const score = robot.play();
        if (score > bestScore) {
          bestRobotIndex = idx;
          bestScore = score;

          if (score > this.#goatScore) {
            this.#goatRobot = robot.clone();
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
        bestScore: bestScore,
        scores,
        generation: this.#currentGeneration + 1,
        generationCount: this.generationCount,
      });

      this.#currentGeneration++;

      if (shouldStopTraining()) return;
      await rest(this.restBetweenGenerations);
    }
  }

  loadRecords(records) {
    const data = JSON.parse(records);

    this.boardSize = data.boardSize;
    this.brainStructure = data.brainStructure;
    this.populationSize = data.populationSize;
    this.generationCount = data.generationCount;
    this.#currentGeneration = data.currentGeneration;
    this.mutationProbability = data.mutationProbability;
    this.useElitism = data.useElitism;
    this.restBetweenGenerations = data.restBetweenGenerations;
    this.#population.forEach((robot, idx) =>
      robot.loadBrain(data.population[idx])
    );
    this.#goatRobot = new Robot(this.brainStructure, new Game(this.boardSize));
    this.#goatRobot.loadBrain(data.goatRobot);
    this.#goatScore = data.goatScore;
  }
}
