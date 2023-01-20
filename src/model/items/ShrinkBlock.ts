import GameController from '../2048/GameController'
import Square from '../2048/Square'
import { IItem } from './Item'

export default class ShrinkBlock implements IItem {
  prepare(game: GameController): void {
    game.board.filledSquares.forEach((sqr) => {
      if (sqr.value > 2) sqr.customStates.selectable = true
    })
  }

  apply(squares: Square[]): boolean {
    if (squares[0].value <= 2) return false
    squares[0].value *= 0.5
    return true
  }
}
