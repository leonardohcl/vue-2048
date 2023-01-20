import GameController from '../2048/GameController'
import Square from '../2048/Square'
import { IItem } from './Item'

export default class MoveBlock implements IItem {
  prepare(game: GameController): void {
    game.board.squares.forEach((sqr) => (sqr.customStates.selectable = true))
  }

  apply(squares: Square[]): boolean {
    const aux = squares[0].value
    squares[0].value = squares[1].value
    squares[1].value = aux
    return true
  }
}
