import GameController from '../GameController'
export interface IGameSettings {
  width: number
  height: number
  historySize: number
  winningBlock: number
}

export default class GameSettings implements IGameSettings {
  width = 0
  height = 0
  historySize = 0
  winningBlock = 0

  constructor(game: GameController | IGameSettings) {
    this.width = game.width
    this.height = game.height
    this.historySize = game.historySize
    this.winningBlock = game.winningBlock
  }
}
