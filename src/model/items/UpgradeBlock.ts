import GameController from '../2048/GameController'
import Square from '../2048/Square'
import { IItem } from './Item'

export default class UpgradeBlock implements IItem {
  prepare(game: GameController): void {
    game.board.filledSquares.forEach(
      (sqr) => (sqr.customStates.selectable = true)
    )
  }

  apply(squares: Square[]): boolean {
    if (squares[0].value === 0) return false
    squares[0].value *= 2
    return true
  }
}