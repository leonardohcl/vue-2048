import GameSettings, { IGameSettings } from './partials/GameSettings'
import GameState, { IGameState } from './partials/GameState'
import GameProgress, { IGameProgress } from './partials/GameProgress'

export interface ISaveFile {
  isEmpty?: boolean
  settings: IGameSettings
  state: IGameState
  progress: IGameProgress
}

export default class SaveFile implements ISaveFile {
  settings
  state
  progress

  constructor(
    settings: IGameSettings,
    state: IGameState,
    progress: IGameProgress
  ) {
    this.settings = settings
    this.state = state
    this.progress = progress
  }

  toString() {
    return btoa(JSON.stringify(this))
  }

  static fromString(str: string) {
    if (!str) return
    const obj = JSON.parse(atob(str))
    return new SaveFile(
      obj.settings || new GameSettings({}),
      obj.state || new GameState(),
      obj.progress || new GameProgress()
    )
  }
}
