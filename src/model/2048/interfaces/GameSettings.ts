import GameController from '../GameController'
export interface IGameSettings {
  width?: number
  height?: number
  historySize?: number
  winningBlock?: number
}

export default class GameSettings implements IGameSettings {
  [key: string]: number | undefined
  width?= 0
  height?= 0
  historySize?= 0
  winningBlock?= 0

  constructor(
    { width, height, historySize, winningBlock }: GameController | IGameSettings = {}
  ) {
    this.width = width
    this.height = height
    this.historySize = historySize
    this.winningBlock = winningBlock
  }
}
