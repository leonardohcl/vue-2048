import GameController from './GameController'
import Board from './Board'
import GameSettings, { IGameSettings } from './interfaces/GameSettings'
import GameState, { IGameState } from './interfaces/GameState'
import GameProgress, { IGameProgress } from './interfaces/GameProgress'

export interface ISaveFile {
  filename: string
  settings: IGameSettings
  state: IGameState
  progress: IGameProgress
}

export default class SaveFile implements ISaveFile {
  filename
  settings
  state
  progress

  constructor(
    filename: string,
    settings: IGameSettings,
    state: IGameState,
    progress: IGameProgress
  ) {
    this.filename = filename
    this.settings = settings
    this.state = state
    this.progress = progress
  }

  toString() {
    return btoa(JSON.stringify(this))
  }

  static fromString(str: string) {
    if (!str) return null
    const obj = JSON.parse(atob(str))
    return new SaveFile(
      obj.filename || '',
      obj.settings || new GameSettings(),
      obj.state || new GameState(),
      obj.progress || new GameProgress()
    )
  }

  getGame() {
    const game = new GameController()
    game.updateSettings(this.settings)
    game.score = this.progress.score
    game.moves = this.progress.moves
    game.undos = this.progress.undos

    game.loadBoardObject(this.state.board)
    game.history = this.state.history.map((entry) => {
      entry.board = Board.fromObject(entry.board)
      return entry
    })

    game.gameOver = false
    game.winner = false
    game.updateGameState()

    return game
  }
}
