import Board from './Board'
import { orderBy } from 'lodash'

const MOVEMENT_ARRAY = ['up', 'down', 'left', 'right']

const MOVEMENT_CONFIG = {
  up: { sortingField: 'row', sortingOrder: 'asc' },
  down: { sortingField: 'row', sortingOrder: 'desc' },
  left: { sortingField: 'col', sortingOrder: 'asc' },
  right: { sortingField: 'col', sortingOrder: 'desc' },
}

export default class GameController {
  score = 0
  winner = false
  gameOver = true
  board = null
  isWaintingUpdate = null

  canMove = {
    up: true,
    down: true,
    left: true,
    right: true,
  }

  constructor(size = 4, updateDelay = 0) {
    this.size = size
    this.updateDelay = updateDelay
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

  clearBoard() {
    this.board = new Board(this.size)
  }

  getBoardAfterMovement(dir, forgetMoves = false) {
    const nextBoard = new Board(this.size)
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
        if (!forgetMoves) sqr.setMove(sqr.row - nextRow, sqr.col - nextCol)
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
        this.isWaintingUpdate = false
        if (spawnBlock) this.spawnBlock(nextBoard)
        this.board = nextBoard
        this.updateGameState()
        resolve()
      }, this.updateDelay)
    })
  }

  async move(dir, shouldSpawnAfter = true) {
    if (this.isWaintingUpdate || !this.canMove[dir]) return

    const { nextBoard, pointsGained } = this.getBoardAfterMovement(dir)

    this.isWaintingUpdate = true
    await this.updateBoard(nextBoard, pointsGained, shouldSpawnAfter)
  }

  start() {
    this.score = 0
    this.gameOver = false
    this.winner = false
    this.clearBoard()
    this.spawnBlock(this.board)
    this.spawnBlock(this.board)
    this.updateGameState()
  }
}
