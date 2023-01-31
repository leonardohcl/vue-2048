import GameController from '../GameController'

export interface IGameProgress {
  score?: number
  undos?: number
  moves?: number
  highestBlock?: number
}

export default class GameProgress implements GameProgress {
  score
  undos
  moves
  highestBlock

  constructor(
    { score = 0, undos = 0, moves = 0, highestBlock = 0 }: GameController | IGameProgress = {}
  ) {
    this.score = score
    this.undos = undos
    this.moves = moves
    this.highestBlock = highestBlock
  }
}
