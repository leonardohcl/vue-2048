import GameController from '../2048/GameController'
import Square from '../2048/Square'
import BreakBlock from './BreakBlock'
import MoveBlock from './MoveBlock'
import ShrinkBlock from './ShrinkBlock'
import UpgradeBlock from './UpgradeBlock'

export interface IItem {
  prepare(game: GameController): void
  apply(squares: Square[]): boolean
}

export default abstract class Item {
  static prepare(item: IItem, game: GameController) {
    item.prepare(game)
  }

  static apply(item: IItem, game: GameController, squares: Square[]) {
    const success = item.apply(squares)
    if (success) {
      game.cleanCustomStates()
      game.updateGameState()
    }
    return success
  }
}
