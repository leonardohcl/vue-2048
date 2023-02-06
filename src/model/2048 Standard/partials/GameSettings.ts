import GameController from '../GameController'

export const enum GameSettingsId {
  Width = 'width',
  Height = 'height',
  HistorySize = 'historySize',
  WinningBlock = 'winningBlock',
}

export type IGameSettings = {
  [key: string]: number | undefined
  width?: number
  height?: number
  historySize?: number
  winningBlock?: number
}

export default class GameSettings implements IGameSettings {
  [key: string]: number | undefined
  width
  height
  historySize
  winningBlock

  constructor(
    { width, height, historySize, winningBlock }: IGameSettings | GameController
  ) {
    this.width = width
    this.height = height
    this.historySize = historySize
    this.winningBlock = winningBlock
  }
}
