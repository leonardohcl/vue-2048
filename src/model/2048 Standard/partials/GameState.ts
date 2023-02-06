import Board from '../../2048/Board'
import GameController from '../GameController'
import IBoard from '../../2048/interfaces/Board'
import { deepCopy } from '../../../utils/copy'

export interface IGameState {
  paused: boolean
  board: IBoard
  history: { board: IBoard; pointsGained: number }[]
}

export default class GameState implements IGameState {
  paused: boolean;
  board: IBoard
  history: { board: IBoard; pointsGained: number }[]

  constructor(
    game: GameController | IGameState = {
      board: new Board(4, 4),
      history: [],
      paused: false
    }
  ) {
    this.paused = game.paused
    this.board = game instanceof GameController ? game.board.getSnapshot() : deepCopy(game.board)
    this.history = game.history
  }
}
