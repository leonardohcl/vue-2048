import { countBy } from 'lodash'
import LooseObject from '@/utils/LooseObject'
import RoguelikeGameController from './GameController'

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
  totalEarned: number
}

export default class GameRewards implements IGameRewards{
  squares:IBlockRewards[] = []
  totalEarned = 0

  constructor(squares:IBlockRewards[], totalEarned:number){
    this.squares = squares
    this.totalEarned = totalEarned
  }

  static calculate(game: RoguelikeGameController): GameRewards | undefined {
    if (game.run === 0 || game.moves === 0) return;

    const count = countBy(game.board.squares, 'value')

    const blockSizes = Object.getOwnPropertyNames(count)

    if (game.winner) BLOCK_VALUES[0] = BLOCK_VALUES[game.winningBlock]
    else BLOCK_VALUES[0] = 0.5

    const squares: IBlockRewards[] = blockSizes.map((size) => ({
      block: parseInt(size),
      count: count[size],
      value: BLOCK_VALUES[size],
      coinsEarned: Math.round(count[size] * BLOCK_VALUES[size]),
    }))

    const totalEarned = Math.round(
      squares.reduce((total, next) => (total += next.coinsEarned), 0)
    )

    return new GameRewards(squares, totalEarned)
  }

}
