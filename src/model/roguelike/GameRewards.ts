import { countBy } from 'lodash'
import GameController from '../2048/GameController'
import LooseObject from '@/utils/LooseObject'

const BLOCK_VALUES: LooseObject = {
  ...new Array(20)
    .fill(2)
    .map((x, ind) => x ** ind)
    .reduce((dict: LooseObject, x, idx) => {
      dict[x] = idx
      return dict
    }, {}),
  0: 0,
}

export interface IBlockRewards {
  block: number
  count: number
  value: number
  coinsEarned: number
}

export interface IGameRewards {
  squares: IBlockRewards[]
}

export default class GameRewards implements IGameRewards {
  squares: IBlockRewards[] = []

  constructor(game: GameController) {
    const count = countBy(game.board.squares, 'value')

    const blockSizes = Object.getOwnPropertyNames(count)

    if (game.winner) BLOCK_VALUES[0] = BLOCK_VALUES[game.winningBlock]
    else BLOCK_VALUES[0] = 0.5

    this.squares = blockSizes.map((size) => ({
      block: parseInt(size),
      count: count[size],
      value: BLOCK_VALUES[size],
      coinsEarned: Math.round(count[size] * BLOCK_VALUES[size]),
    }))
  }

  get totalEarned(): number {
    return Math.round(
      this.squares.reduce((total, next) => (total += next.coinsEarned), 0)
    )
  }
}
