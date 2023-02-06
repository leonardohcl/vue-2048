//#region Imports
import Board from '../2048/Board'
import SaveFile from '../Game Utils/SaveFile/SaveFile'
import { IGameSettings } from '../Game Utils/SaveFile/interfaces/GameSettings'
import IBoard from '../2048/interfaces/Board'
import RankingEntry from './RankingEntry'
import Game from '../2048/Game'
import { MoveDirection, onUpdateSquareFn } from '../2048/interfaces/Game'
import { SquareTrackingMeta } from './interfaces/Square'
import Square from '../2048/Square'
import IGameController from './interfaces/GameController'

//#endregion

//#region Helpers
const rememberMoves: onUpdateSquareFn = (sqr, { nextRow, nextCol }) => {
  sqr.setMeta(SquareTrackingMeta.NextMove, {
    vertical: sqr.row - nextRow,
    horizontal: sqr.col - nextCol,
  })
}
//#endregion
export default class GameController extends Game implements IGameController {
  //#region Attributes

  private _endless = false
  private _updateDelay = 0
  private _historySize = 0
  private _isWaintingUpdate = false

  protected _undos = 0
  protected _moves = 0
  protected _paused = false

  board: Board

  private _history: {
    pointsGained: number
    board: IBoard
  }[] = []

  //#endregion

  //#region Getters

  get undos() {
    return this._undos
  }
  get moves() {
    return this._moves
  }
  get endless() {
    return this._endless
  }
  get historySize() {
    return this._historySize
  }
  get paused() {
    return this._paused
  }
  get highestBlock() {
    return this.board.highestBlock
  }
  get history() {
    return this._history.map((entry) => ({
      pointsGained: entry.pointsGained,
      board: entry.board,
    }))
  }
  get updateDelay() {
    return this._updateDelay
  }
  get winner() {
    return this.isWinner() && !this._endless
  }
  get settings(): IGameSettings {
    return {
      width: this.width,
      height: this.height,
      historySize: this.historySize,
      winningBlock: this.winningBlock,
    }
  }

  //#endregion

  //#region Undo
  private addToHistory(board: Board, pointsGained: number) {
    if (this._historySize < 1) return
    this._history.push({ board: board.getSnapshot(), pointsGained })
    if (this._history.length > this._historySize) {
      this._history = this._history.splice(1)
    }
  }

  private revertBoard(previousBoard: IBoard, pointsGained: number) {
    this._isWaintingUpdate = true

    const board = Board.fromObject(previousBoard)
    board.filledSquares.forEach((sqr) =>
      sqr.setMeta(SquareTrackingMeta.IsReverse, true)
    )

    this._score -= pointsGained
    this.board = board
    this.updateValidMoves()

    return new Promise<{ success: boolean; pointsLost: number }>((resolve) => {
      setTimeout(() => {
        this.clearTrackingMeta(this.board.filledSquares)
        this._isWaintingUpdate = false
        resolve({ success: true, pointsLost: pointsGained })
      }, this._updateDelay)
    })
  }

  async undo() {
    if (this._isWaintingUpdate) return { success: false, pointsLost: 0 }
    const previousState = this._history.pop()
    if (!previousState) return { success: false, pointsLost: 0 }
    this._moves--
    this._undos++
    this._isWaintingUpdate = true
    return await this.revertBoard(
      previousState.board,
      previousState.pointsGained
    )
  }
  //#endregion

  //#region Move
  protected getNextBoard(
    dir: MoveDirection,
    onUpdateSquare: onUpdateSquareFn = rememberMoves
  ) {
    return super.getNextBoard(dir, onUpdateSquare)
  }

  async move(dir: MoveDirection, shouldSpawnAfter = true) {
    if (this._isWaintingUpdate || !this._canMove[dir])
      return { success: false, pointsGained: 0 }

    this._isWaintingUpdate = true

    const { nextBoard, pointsGained } = this.getNextBoard(dir)

    return new Promise<{ success: boolean; pointsGained: number }>(
      (resolve) => {
        setTimeout(() => {
          this.addToHistory(this.board, pointsGained)
          this._score += pointsGained
          this._moves++

          if (shouldSpawnAfter) this.spawnBlock(nextBoard)

          this.board = nextBoard
          this.updateGameState()

          this._isWaintingUpdate = false

          resolve({ success: true, pointsGained })
        }, this._updateDelay)
      }
    )
  }
  //#endregion

  //#region Memory
  getSnapshot(): IGameController {
    const game = super.getSnapshot()
    return {
      ...game,
      endless: this.endless,
      history: this.history,
      undos: this.undos,
      moves: this.moves,
      updateDelay: this.updateDelay,
      historySize: this.historySize,
      paused: this.paused,
      highestBlock: this.board.highestBlock,
    }
  }

  getSaveFile() {
    return new SaveFile(this.getSnapshot())
  }

  protected loadBoardObject(board: IBoard) {
    this.board = Board.fromObject(board)
    this.updateGameState()
  }

  load(save: SaveFile) {
    this.reset()
    this.updateSettings(save.settings)
    this._score = save.progress.score ?? 0
    this._moves = save.progress.moves ?? 0
    this._undos = save.progress.undos ?? 0
    this._paused = save.state.paused ?? false

    this.loadBoardObject(save.state.board)
    this._history = save.state.history.map((entry) => {
      entry.board = Board.fromObject(entry.board).getSnapshot()
      return entry
    })

    this.updateGameState()
  }
  //#endregion

  //#region Settings
  updateSettings(newSettings: IGameSettings) {
    const settings = { ...this.settings, ...newSettings }
    this._historySize = settings.historySize || 0
    this._winningBlock = settings.winningBlock || 2048
    this.board = new Board(
      newSettings.width ?? this.width,
      newSettings.height ?? this.height
    )
  }
  //#endregion

  //#region State
  reset() {
    super.reset()
    this._moves = 0
    this._undos = 0
    this._history = []
    this._endless = false
    this._isWaintingUpdate = false
    this._paused = false
  }

  activateEndless() {
    this._endless = true
  }

  pause(value?: boolean) {
    this._paused = value ?? !this._paused
  }

  updateGameState() {
    super.updateGameState()
    if (!this.isRunning) this.pause(false)
  }

  clearTrackingMeta(squares: Square[] = this.board.squares) {
    squares.forEach((sqr) => {
      sqr.setMeta(SquareTrackingMeta.NextMove, { vertical: 0, horizontal: 0 })
      sqr.setMeta(SquareTrackingMeta.IsReverse, false)
    })
  }

  start() {
    super.start()
    this.pause(false)
    this._endless = false
    this._moves = 0
    this._undos = 0
    this._history = []
  }

  //#endregion

  //#region Ranking

  getRankingEntry() {
    return new RankingEntry({
      id: '',
      name: '',
      height: this.height,
      width: this.width,
      block: this.highestBlock,
      score: this._score,
      moves: this._moves,
      undos: this._undos,
    })
  }
  //#endregion

  constructor({
    width = 4,
    height = 4,
    winningBlock = 2048,
    historySize = 2,
    updateDelay = 0,
  } = {}) {
    super({ width, height, winningBlock })
    this._historySize = historySize
    this._updateDelay = updateDelay
    this.board = new Board(width, height)
  }
}
