import { IGameSettings } from './interfaces/GameSettings'
import { IGameState } from './interfaces/GameState'
import { IGameProgress } from './interfaces/GameProgress'
import IGameController from '@/model/2048 Standard/interfaces/GameController'

export interface ISaveFile {
  settings: IGameSettings
  state: IGameState
  progress: IGameProgress
}

export default class SaveFile implements ISaveFile {
  settings: IGameSettings
  state: IGameState
  progress: IGameProgress

  constructor(game: IGameController) {
    this.settings = {
      width: game.width,
      height: game.height,
      historySize: game.historySize,
      winningBlock: game.winningBlock,
    }
    this.state = {
      board: game.board,
      history: game.history,
      paused: game.paused,
    }
    this.progress = {
      highestBlock: game.highestBlock,
      moves: game.moves,
      undos: game.undos,
      score: game.score,
    }
  }
}
