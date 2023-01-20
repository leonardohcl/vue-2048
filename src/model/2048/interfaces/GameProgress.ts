import GameController from '../GameController'

export interface IGameProgress {
  score: number
  undos: number
  moves: number
  board: { highestValue: number }
}

export default class GameProgress implements GameProgress {
  score = 0
  undos = 0
  moves = 0
  board = { highestValue: 0 }
  highestValue = 0

  constructor(game: GameController | IGameProgress) {
    this.score = game.score
    this.undos = game.undos
    this.moves = game.moves
    this.highestValue = game.board.highestValue || 0
  }
}
