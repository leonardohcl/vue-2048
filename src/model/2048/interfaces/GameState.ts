import { deepCopy } from '../../../utils/copy'
import Board from '../Board'
import GameController from '../GameController'
import IBoard from '../interfaces/Board'

export interface IGameState {
  gameOver: boolean
  winner: boolean
  board: IBoard
  history: { board: IBoard; pointsGained: number }[]
}

export default class GameState implements IGameState {
  board: IBoard
  history: { board: IBoard; pointsGained: number }[]
  gameOver: boolean
  winner: boolean

  constructor(
    game: GameController | IGameState = {
      gameOver: false,
      winner: false,
      board: new Board(4, 4),
      history: [],
    }
  ) {
    this.board = deepCopy(game.board)
    this.history = deepCopy(game.history)
    this.gameOver = game.gameOver
    this.winner = game.winner
  }
}
