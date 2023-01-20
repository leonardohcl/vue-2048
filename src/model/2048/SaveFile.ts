import GameController from './GameController'
import Board from './Board'
import { IGameSettings } from './interfaces/GameSettings'
import { IGameState } from './interfaces/GameState'
import { IGameProgress } from './interfaces/GameProgress'

export default class SaveFile {
  filename: string
  settings: IGameSettings
  state: IGameState
  progress: IGameProgress

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

  static fromString(str:string) {
    if (!str) return null
    const obj = JSON.parse(atob(str))
    return new SaveFile(obj.filename, obj.settings, obj.state, obj.progress)
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
