import GameController from '../../../2048 Standard/GameController'

export const enum GameSettingsId {
  Width = 'width',
  Height = 'height',
  HistorySize = 'historySize',
  WinningBlock = 'winningBlock',
}

export type IGameSettings = {
  [key: string]: number | undefined
  width: number
  height: number
  historySize: number
  winningBlock: number
}