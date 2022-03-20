import Robot from "./Robot";
import WeighedRoulette from "./WeighedRoulette";
import Game from "../2048/GameControllerLite";
import { rest } from "../../utils/async";

export default class RobotFactory {
  #id = "";
  #population = [];
  #goatRobot = null;
  #goatScore = -Infinity;
  #currentGeneration = 0;
  #boardSize = 4;
  #brainStructure = [];
  #useBias = true;
  #useElitism = true;
  #mutationProbability = 0;
  #generationCount = 0;
  #populationSize = 0;
  #restBetweenGenerations = 10;

  constructor(
    id,
    boardSize,
    brainStructure,
    populationSize,
    generationCount,
    mutationProbability,
    useElitism = true,
    useBias = true,
    restBetweenGenerations = 10
  ) {
    this.#id = id;
    this.#boardSize = boardSize;
    this.#brainStructure = brainStructure;
    this.#populationSize = populationSize;
    this.#generationCount = generationCount;
    this.#mutationProbability = mutationProbability;
    this.#useElitism = useElitism;
    this.#useBias = useBias;
    this.#restBetweenGenerations = restBetweenGenerations;
    this.#population = new Array(this.#populationSize).fill(0).map(
      () =>
        new Robot(brainStructure, new Game(boardSize), {
          useBias: this.#useBias,
        })
    );
  }

  get id() {
    return this.#id;
  }

  get boardSize() {
    return this.#boardSize;
  }

  get brainStructure() {
    return [...this.#brainStructure];
  }

  get robot() {
    return this.#goatRobot ? this.#goatRobot.clone() : null;
  }

  get mutationProbability() {
    return this.#mutationProbability;
  }

  get generationCount() {
    return this.#generationCount;
  }

  get populationSize() {
    return this.#populationSize;
  }

  get useBias() {
    return this.#useBias;
  }

  get useElitism() {
    return this.#useElitism;
  }

  get score() {
    return this.#goatScore;
  }

  get currentGeneration() {
    return this.#currentGeneration;
  }

  get records() {
    const records = {
      id: this.#id,
      boardSize: this.boardSize,
      brainStructure: this.#brainStructure,
      populationSize: this.#populationSize,
      generationCount: this.#generationCount,
      currentGeneration: this.#currentGeneration,
      mutationProbability: this.#mutationProbability,
      useElitism: this.#useElitism,
      restBetweenGenerations: this.#restBetweenGenerations,
      population: this.#population.map(robot => robot.synapses),
      goatRobot: this.#goatRobot.synapses,
      goatScore: this.#goatScore,
    };

    return records;
  }

  async train(
    generationCallback = () => null,
    shouldStopTraining = () => false
  ) {
    while (this.#currentGeneration < this.#generationCount) {
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
        if (this.#useElitism && idx === bestRobotIndex) return;
        const breedingRobot = this.#population[roulette.getIndex()];
        const crossoverPoint = Math.random();
        robot.crossover(
          breedingRobot,
          crossoverPoint,
          this.#mutationProbability
        );
      });

      generationCallback({
        bestScore: bestScore,
        scores,
        generation: this.#currentGeneration + 1,
        generationCount: this.#generationCount,
      });

      this.#currentGeneration++;

      if (shouldStopTraining()) return;
      await rest(this.#restBetweenGenerations);
    }
  }

  static fromRecords(records) {
    const factory = new RobotFactory(
      records.id,
      records.boardSize,
      records.brainStructure,
      records.populationSize,
      records.generationCount,
      records.mutationProbability,
      records.useElitism,
      records.restBetweenGenerations
    );
    factory.loadRecords(records);
    return factory;
  }

  loadRecords(records) {
    this.#currentGeneration = records.currentGeneration;
    this.#population.forEach((robot, idx) =>
      robot.loadBrain(records.population[idx])
    );
    this.#goatRobot = new Robot(this.#brainStructure, new Game(this.boardSize));
    this.#goatRobot.loadBrain(records.goatRobot);
    this.#goatScore = records.goatScore;
  }
}
