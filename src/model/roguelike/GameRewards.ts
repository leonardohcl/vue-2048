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
  [`${0}_win`]: 10,
  [`${0}_loss`]: 0.5,
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

    const zero_idx = blockSizes.findIndex((x) => x === '0')
    if (zero_idx >= 0) {
      const zero_name = `0_${game.winner ? 'win' : 'loss'}`
      blockSizes[zero_idx] = zero_name
      count[zero_name] = count[0]
    }

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
