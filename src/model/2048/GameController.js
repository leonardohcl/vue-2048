import Board from './Board'
import { orderBy } from 'lodash'
import SaveFile from './SaveFile'
import { deepCopy } from '../../utils/copy'

const MOVEMENT_ARRAY = ['up', 'down', 'left', 'right']

const MOVEMENT_CONFIG = {
  up: { sortingField: 'row', sortingOrder: 'asc' },
  down: { sortingField: 'row', sortingOrder: 'desc' },
  left: { sortingField: 'col', sortingOrder: 'asc' },
  right: { sortingField: 'col', sortingOrder: 'desc' },
}

export class GameSettings {
  constructor(game) {
    this.width = game.width
    this.height = game.height
    this.historySize = game.historySize
    this.updateDelay = game.updateDelay
  }
}

export class GameState {
  constructor(game) {
    this.board = deepCopy(game.board)
    this.history = deepCopy(game.history)
  }
}

export class GameProgress {
  constructor(game) {
    this.score = game.score
    this.undos = game.undos
    this.moves = game.moves
    this.highestValue = game.board.highestValue
  }
}

export default class GameController {
  score = 0
  undos = 0
  moves = 0
  winner = false
  paused = false
  gameOver = true
  board = null
  isWaintingUpdate = false
  history = []

  canMove = {
    up: true,
    down: true,
    left: true,
    right: true,
  }

  constructor(width = 4, height = 4, historySize = 2, updateDelay = 0) {
    this.width = width
    this.height = height
    this.historySize = historySize
    this.updateDelay = updateDelay
    this.clearBoard()
  }

  static getSaveFile(filename, game = this) {
    return new SaveFile(
      filename,
      new GameSettings(game),
      new GameState(game),
      new GameProgress(game)
    )
  }

  loadSaveFile(save) {
    this.updateSettings(save.settings)
    this.score = save.progress.score
    this.moves = save.progress.moves
    this.undos = save.progress.undos

    this.loadBoardObject(save.state.board)
    this.history = save.state.history.map((entry) => {
      entry.board = Board.fromObject(entry.board)
      return entry
    })

    this.gameOver = false
    this.winner = false
    this.updateGameState()
  }

  updateSettings(newSettings) {
    this.score = 0
    this.history = []
    this.winner = false
    this.gameOver = true
    this.isWaintingUpdate = false
    const settings = { ...new GameSettings(this), ...newSettings }
    this.width = settings.width
    this.height = settings.height
    this.historySize = settings.historySize
    this.updateDelay = settings.updateDelay
    this.clearBoard()
  }

  updateMoveValidation(dir) {
    const { nextBoard } = this.getBoardAfterMovement(dir, true)
    this.canMove[dir] =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  updateValidMoves() {
    MOVEMENT_ARRAY.forEach((move) => this.updateMoveValidation(move))
  }

  isWinner() {
    return !this.winner && this.board.highestValue >= 2048
  }

  isGameOver() {
    return (
      !this.canMove.up &&
      !this.canMove.down &&
      !this.canMove.right &&
      !this.canMove.left
    )
  }

  spawnBlock(board) {
    const options = board.emptySquares

    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

    options[selectedIndex].setSpawn()
    if (Math.random() > 0.1) options[selectedIndex].setValue(2)
    else options[selectedIndex].setValue(4)
  }

  loadBoardPreset(flatBoard) {
    this.board.loadPreset(flatBoard)
    this.updateGameState()
  }

  loadBoardObject(board) {
    this.board = Board.fromObject(board)
    this.updateGameState()
  }

  clearBoard() {
    this.board = new Board(this.width, this.height)
  }

  addToHistory(board, pointsGained) {
    if (this.historySize < 1) return
    this.history.push({ board, pointsGained })
    if (this.history.length > this.historySize) {
      this.history = this.history.splice(1)
    }
  }

  getBoardAfterMovement(dir, forgetMoves = false) {
    const nextBoard = new Board(this.width, this.height)
    let pointsGained = 0
    const squares = orderBy(
      this.board.filledSquares,
      [MOVEMENT_CONFIG[dir].sortingField],
      [MOVEMENT_CONFIG[dir].sortingOrder]
    )

    squares.forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        dir
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        pointsGained += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (!forgetMoves)
          sqr.setMove({
            vertical: sqr.row - nextRow,
            horizontal: sqr.col - nextCol,
            reverse: false,
            spawn: false,
          })
      }
    })

    return { nextBoard, pointsGained }
  }

  updateGameState() {
    if (this.isWinner()) this.winner = true

    this.updateValidMoves()

    if (this.isGameOver()) this.gameOver = true
  }

  updateBoard(nextBoard, pointsGained, spawnBlock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.score += pointsGained
        if (spawnBlock) this.spawnBlock(nextBoard)
        this.addToHistory(this.board, pointsGained)
        this.board = nextBoard
        this.updateGameState()
        this.isWaintingUpdate = false
        resolve()
      }, this.updateDelay)
    })
  }

  revertBoard(previousBoard, pointsGained) {
    this.isWaintingUpdate = true

    previousBoard.filledSquares.forEach((sqr) => sqr.setMove({ reverse: true }))

    this.score -= pointsGained
    this.board = previousBoard
    this.updateValidMoves()

    return new Promise((resolve) => {
      setTimeout(() => {
        this.board.filledSquares.forEach((sqr) =>
          sqr.setMove({ reverse: false, spawn: false, horizontal: 0, vertical: 0 })
        )
        this.isWaintingUpdate = false
        resolve()
      }, this.updateDelay)
    })
  }

  async move(dir, shouldSpawnAfter = true) {
    if (this.isWaintingUpdate || !this.canMove[dir]) return

    this.isWaintingUpdate = true

    const { nextBoard, pointsGained } = this.getBoardAfterMovement(dir, false)

    this.moves++
    await this.updateBoard(nextBoard, pointsGained, shouldSpawnAfter)
  }

  async undo() {
    if (this.isWaintingUpdate || !this.history.length) return false
    this.moves--
    this.undos++
    const previousState = this.history.pop()
    this.isWaintingUpdate = true
    await this.revertBoard(previousState.board, previousState.pointsGained)
    return true
  }

  start() {
    this.score = 0
    this.moves = 0
    this.undos = 0
    this.history = []
    this.gameOver = false
    this.winner = false
    this.clearBoard()
    this.spawnBlock(this.board)
    this.spawnBlock(this.board)
    this.updateGameState()
  }
}
