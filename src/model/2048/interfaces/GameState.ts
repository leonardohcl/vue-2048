import { deepCopy } from '../../../utils/copy'
import GameController from '../GameController'
import IBoard from '../interfaces/Board'

export interface IGameState {
  board: IBoard
  history: { board: IBoard; pointsGained: number }[]
}

export default class GameState {
  board:IBoard
  history: { board: IBoard; pointsGained: number }[]

  constructor(game: GameController | IGameState) {
    this.board = deepCopy(game.board)
    this.history = deepCopy(game.history)
  }
}
