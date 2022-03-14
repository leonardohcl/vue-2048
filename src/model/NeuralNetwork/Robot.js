import Game from '../2048/GameControllerLite'
import NeuralNetwork from './NeuralNetwork'
import WeightedRoulette from './WeighedRoulette'

const moves = {
  NONE: -1,
  LEFT: 0,
  UP: 1,
  DOWN: 2,
  RIGHT: 3,
}

const intToMove = (val) => {
  switch (val) {
    case moves.LEFT:
      return moves.LEFT
    case moves.UP:
      return moves.UP
    case moves.DOWN:
      return moves.DOWN
    case moves.RIGHT:
      return moves.RIGHT
  }
  return moves.RIGHT
}

export default class Robot {
  #game = null
  #brain = null
  constructor(
    innerLayers = [],
    game = new Game(),
    config = {
      useBias: true,
      useBatchNormalization: true,
    }
  ) {
    this.#game = game
    this.#brain = new NeuralNetwork(
      [this.#game.size * this.#game.size, ...innerLayers, 4],
      config.useBias,
      config.useBatchNormalization
    )
  }

  get boardSize() {
    return this.#game.boardSize
  }

  get board() {
    return this.#game.board
  }

  get brain() {
    return this.#brain
  }

  play(highestBlock = 2048) {
    this.#game.start()
    let move
    do {
      move = this.#getNextMove()
      switch (move) {
        case moves.UP:
          this.#game.move('up')
          break
        case moves.LEFT:
          this.#game.move('left')
          break
        case moves.RIGHT:
          this.#game.move('right')
          break
        case moves.DOWN:
          this.#game.move('down')
          break
      }
    } while (
      !this.#game.isGameOver &&
      move != moves.NONE &&
      this.#game.board.highestValue < highestBlock
    )

    return this.#game.score
  }

  #getNextMove() {
    if (this.#game.isGameOver) return moves.NONE
    const input = [this.#game.board.squares.map((sqr) => sqr.value)]
    const [decisions] = this.#brain.processInput(input)
    let move = moves.NONE,
      discardedMoves = []
    do {
      let selectedMove = this.#getMove(decisions, discardedMoves)
      if (this.#moveIsValid(selectedMove)) move = selectedMove
      else discardedMoves.push(selectedMove)
    } while (move === moves.NONE && discardedMoves.length < 4)

    return move
  }

  #moveIsValid(move) {
    switch (move) {
      case moves.LEFT:
        return this.#game.canMoveLeft
      case moves.UP:
        return this.#game.canMoveUp
      case moves.DOWN:
        return this.#game.canMoveDown
      case moves.RIGHT:
        return this.#game.canMoveRight
    }
  }

  #getMove(decision, ignore = []) {
    let bestIndex = -1,
      bestValue = -Infinity
    decision.forEach((prob, idx) => {
      if (prob >= bestValue && !ignore.includes(idx)) {
        bestValue = prob
        bestIndex = idx
      }
    })

    return intToMove(bestIndex)
  }

  crossover(robot, crossoverPoint, mutationProbability = 0) {
    this.#brain.crossover(robot.brain, crossoverPoint, mutationProbability)
  }

  static async getTrained(
    innerLayers,
    populationSize,
    generationCount,
    mutationProbability,
    withElitism = true,
    generationCallback = () => null,
    haltGeneration = 100
  ) {
    const game = new Game(4, 0)
    const robots = new Array(populationSize)
      .fill(0)
      .map(() => new Robot(innerLayers, game))
    var bestRobot,
      bestScore = -Infinity,
      scores = new Array(populationSize).fill(0),
      goatRobot,
      goatScore = -Infinity

    for (let gen = 1; gen <= generationCount; gen++) {
      bestRobot = null
      bestScore = -Infinity

      // Get fitness
      for (let i = 0; i < robots.length; i++) {
        scores[i] = robots[i].play()
        if (scores[i] > bestScore) {
          bestScore = scores[i]
          bestRobot = robots[i]

          if (scores[i] > goatScore) {
            goatRobot = robots[i]
            goatScore = scores[i]
          }
        }
      }
      const roulette = new WeightedRoulette(scores)

      // Breed and mutate
      for (let i = 0; i < robots.length; i++) {
        if (withElitism && robots[i] === bestRobot) continue
        const breedingRobot = robots[roulette.getIndex()]
        const crossoverPoint = Math.random()
        robots[i].crossover(breedingRobot, crossoverPoint, mutationProbability)
      }

      generationCallback({
        bestScore,
        scores,
        generation: gen,
        generationCount: generationCount,
      })

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, haltGeneration)
      })
    }

    return goatRobot
  }
}
