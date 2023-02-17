import randomWeightedSelection from '../../utils/randomSelection'
import { orderBy } from 'lodash'
import Board from './Board'
import {
  GameActionTracker,
  IGame,
  MoveDirection,
  onUpdateSquareFn,
} from './interfaces/Game'
import { SquareStateMeta } from './interfaces/Square'
import { SquareConsumableMeta } from '../Game Utils/Item/interfaces/Square'

const SORTING_CONFIG = {
  [MoveDirection.Up]: { field: 'row', order: 'asc' },
  [MoveDirection.Down]: { field: 'row', order: 'desc' },
  [MoveDirection.Left]: { field: 'col', order: 'asc' },
  [MoveDirection.Right]: { field: 'col', order: 'desc' },
}

export default class Game implements IGame {
  protected _isRunning = false
  protected _score = 0
  protected _winningBlock: number
  protected _canMove = new GameActionTracker()
  board: Board

  get score() {
    return this._score
  }
  get winner() {
    return this.isWinner()
  }
  get gameOver() {
    return this.isGameOver()
  }
  get width() {
    return this.board.width
  }
  get height() {
    return this.board.height
  }
  get winningBlock() {
    return this._winningBlock
  }
  get canMove() {
    return { ...this._canMove }
  }
  get isRunning() {
    return this._isRunning
  }

  private updateMoveValidation(dir: MoveDirection) {
    const squares = this.board.squares
    for (let idx = 0; idx < squares.length; idx++) {
      if (squares[idx].isEmpty) continue
      const neighbor = this.board.getSquareNeighbor(
        squares[idx].row,
        squares[idx].col,
        dir
      )
      if (!neighbor) continue
      if (this.board.canSquareMove(squares[idx], neighbor, true)) {
        this._canMove[dir] = true
        return
      }
    }
    this._canMove[dir] = false
  }

  protected getNextBoard(
    dir: MoveDirection,
    onUpdateSquare: onUpdateSquareFn = () => {}
  ) {
    const nextBoard = new Board(this.width, this.height)
    let pointsGained = 0

    const squares = orderBy(
      this.board.filledSquares,
      SORTING_CONFIG[dir].field,
      SORTING_CONFIG[dir].order as 'asc' | 'desc'
    )

    squares.forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value, {
        [SquareConsumableMeta.Frozen]: sqr.meta[SquareConsumableMeta.Frozen],
      })
      if (sqr.meta[SquareConsumableMeta.Frozen]) return
      const { row: nextRow, col: nextCol } = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        dir
      )
      if (nextRow !== undefined && nextCol !== undefined) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        pointsGained += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        onUpdateSquare(sqr, { nextRow, nextCol })
      }
    })
    
    nextBoard.resetMeta([SquareConsumableMeta.Frozen])

    return { nextBoard, pointsGained }
  }

  protected updateValidMoves() {
    const directions = [
      MoveDirection.Down,
      MoveDirection.Up,
      MoveDirection.Left,
      MoveDirection.Right,
    ]
    directions.forEach((direction) => this.updateMoveValidation(direction))
  }

  protected spawnBlock(board: Board) {
    const options = board.emptySquares

    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

    options[selectedIndex].setMeta(SquareStateMeta.Spawned, true)

    const value = randomWeightedSelection<number>([2, 4], [9, 1]) ?? 0
    options[selectedIndex].setValue(value)
  }

  protected isWinner() {
    return this.board.highestBlock >= this._winningBlock
  }

  protected isGameOver() {
    return (
      !this._canMove[MoveDirection.Up] &&
      !this._canMove[MoveDirection.Down] &&
      !this._canMove[MoveDirection.Right] &&
      !this._canMove[MoveDirection.Left]
    )
  }

  protected clearBoard() {
    this.board = new Board(this.width, this.height)
  }

  protected updateGameState() {
    this.updateValidMoves()
    this._isRunning = !this.gameOver && !this.winner
  }

  loadBoardPreset(flatBoard: number[]) {
    this.board.loadPreset(flatBoard)
    this.updateGameState()
  }

  move(dir: MoveDirection, shouldSpawnAfter = true) {
    if (!this._canMove[dir])
      return Promise.resolve({ success: false, pointsGained: 0 })
    const { nextBoard, pointsGained } = this.getNextBoard(dir)
    this._score += pointsGained
    if (shouldSpawnAfter) this.spawnBlock(nextBoard)
    this.board = nextBoard
    this.updateGameState()
    return Promise.resolve({ success: true, pointsGained })
  }

  reset() {
    this._score = 0
    this._isRunning = false
  }

  start() {
    this._score = 0
    this.clearBoard()
    this._isRunning = true
    this.spawnBlock(this.board)
    this.spawnBlock(this.board)
    this.updateValidMoves()
  }

  getSnapshot(): IGame {
    return {
      score: this.score,
      width: this.width,
      height: this.height,
      winningBlock: this.winningBlock,
      board: this.board.getSnapshot(),
      winner: this.winner,
      gameOver: this.gameOver,
      canMove: this.canMove,
    }
  }

  constructor({ width = 4, height = 4, winningBlock = 2048 } = {}) {
    this._winningBlock = winningBlock
    this.board = new Board(height, width)
  }
}
