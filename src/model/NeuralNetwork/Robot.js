import Game from "../2048/GameControllerLite";
import NeuralNetwork from "./NeuralNetwork";
import { moves, moveToString, intToMove } from "../../utils/robot";
import { rest } from "../../utils/async";

export default class Robot {
  #game = null;
  #brain = null;
  #brainStructure = [];
  #usebias = false;
  constructor(
    brainStructure = [],
    game = new Game(),
    config = {
      useBias: true,
      useBatchNormalization: true,
    }
  ) {
    this.#game = game;
    this.#brainStructure = brainStructure;
    this.#usebias = config.useBias;

    this.#brain = new NeuralNetwork(
      [this.#game.size * this.#game.size, ...brainStructure, 4],
      config.useBias,
      config.useBatchNormalization
    );
  }

  get boardSize() {
    return this.#game.boardSize;
  }

  get board() {
    return this.#game.board;
  }

  get brain() {
    return this.#brain;
  }

  get synapses() {
    return this.#brain.weights;
  }

  setGame(game) {
    this.#game = game;
  }

  play(highestBlock = 2048) {
    if (this.#game.isGameOver) this.#game.start();
    let move;
    do {
      move = this.#move();
    } while (
      !this.#game.isGameOver &&
      move != moves.NONE &&
      this.#game.board.highestValue < highestBlock
    );

    return this.#game.score;
  }

  async asyncPlay(waitingTime, shouldStop = () => false, highestBlock = 2048) {
    if (this.#game.isGameOver) this.#game.start();
    let move;
    do {      
        move = this.#move();
        if(shouldStop()) return this.#game.score;
        await rest(waitingTime)
    } while (
      !this.#game.isGameOver &&
      move != moves.NONE &&
      this.#game.board.highestValue < highestBlock
    );
    return this.#game.score;
  }

  #move() {
    let move, direction;
    move = this.#getNextMove();
    direction = moveToString(move);
    this.#game.move(direction);
    return move;
  }

  #getNextMove() {
    if (this.#game.isGameOver) return moves.NONE;
    const input = [this.#game.board.squares.map(sqr => sqr.value)];
    const [decisions] = this.#brain.processInput(input);
    let move = moves.NONE,
      discardedMoves = [];
    do {
      let selectedMove = this.#getMove(decisions, discardedMoves);
      if (this.#moveIsValid(selectedMove)) move = selectedMove;
      else discardedMoves.push(selectedMove);
    } while (move === moves.NONE && discardedMoves.length < 4);

    return move;
  }

  #moveIsValid(move) {
    switch (move) {
      case moves.LEFT:
        return this.#game.canMoveLeft;
      case moves.UP:
        return this.#game.canMoveUp;
      case moves.DOWN:
        return this.#game.canMoveDown;
      case moves.RIGHT:
        return this.#game.canMoveRight;
    }
  }

  #getMove(decision, ignore = []) {
    let bestIndex = -1,
      bestValue = -Infinity;
    decision.forEach((prob, idx) => {
      if (prob >= bestValue && !ignore.includes(idx)) {
        bestValue = prob;
        bestIndex = idx;
      }
    });

    return intToMove(bestIndex);
  }

  crossover(robot, crossoverPoint, mutationProbability = 0) {
    this.#brain.crossover(robot.brain, crossoverPoint, mutationProbability);
  }

  loadBrain(synapses) {
    this.#brain.loadWeights(synapses);
  }

  clone() {
    const clone = new Robot(this.#brainStructure, new Game(this.#game.size), {
      useBias: this.#usebias,
    });

    clone.loadBrain(this.synapses);

    return clone;
  }
}
