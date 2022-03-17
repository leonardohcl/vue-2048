import Board from './Board'
import { orderBy } from 'lodash'

export default class GameController {
  score = 0
  #isOver = true
  #lastMove = null
  board = null

  canMoveRight = false
  canMoveLeft = false
  canMoveUp = false
  canMoveDown = false

  constructor(size = 4) {
    this.size = size
    this.#clearBoard()
  }

  get isGameOver() {
    return this.#isOver
  }

  #spawnBlock(board) {
    const options = board.emptySquares

    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

    options[selectedIndex].setSpawn()
    if (Math.random() > 0.1) options[selectedIndex].setValue(2)
    else options[selectedIndex].setValue(4)
  }

  #clearBoard() {
    this.board = new Board(this.size)
  }

  #clearMovements() {
    this.canMoveRight = true
    this.canMoveLeft = true
    this.canMoveUp = true
    this.canMoveDown = true
  }

  #moveRight() {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['col'], ['desc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getValidMovement(
        sqr.row,
        sqr.col,
        'right'
      )
      if (nextRow != null || nextCol != null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
      }
    })
    return [nextBoard, score]
  }

  #moveLeft() {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['col'], ['asc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getValidMovement(
        sqr.row,
        sqr.col,
        'left'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
      }
    })
    return [nextBoard, score]
  }

  #moveUp() {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['row'], ['asc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getValidMovement(
        sqr.row,
        sqr.col,
        'up'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
      }
    })
    return [nextBoard, score]
  }

  #moveDown() {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['row'], ['desc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getValidMovement(
        sqr.row,
        sqr.col,
        'down'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
      }
    })
    return [nextBoard, score]
  }

  #updateGameState() {
    if (
      !this.canMoveUp &&
      !this.canMoveDown &&
      !this.canMoveRight &&
      !this.canMoveLeft
    ) {
      this.#isOver = true
    }
  }

  #updateBoard(nextBoard, nextScore) {
    if (this.#boardIsDifferent(nextBoard)) {
      this.score += nextScore
      this.#spawnBlock(nextBoard)
      this.board = nextBoard
      this.#clearMovements()
    } else {
      switch (this.#lastMove) {
        case 'up':
          this.canMoveUp = false
          break
        case 'down':
          this.canMoveDown = false
          break
        case 'right':
          this.canMoveRight = false
          break
        case 'left':
          this.canMoveLeft = false
          break
      }
    }
    this.#updateGameState()
  }

  move(dir) {
    let nextBoard, nextScore
    switch (dir) {
      case 'right':
        [nextBoard, nextScore] = this.#moveRight(true)
        break
      case 'left':
        [nextBoard, nextScore] = this.#moveLeft(true)
        break
      case 'up':
        [nextBoard, nextScore] = this.#moveUp(true)
        break
      case 'down':
        [nextBoard, nextScore] = this.#moveDown(true)
        break
    }

    this.#lastMove = dir

    this.#updateBoard(nextBoard, nextScore)
  }

  #boardIsDifferent(nextBoard) {
    const boardSize = this.size * this.size
    const currentBoardValues = this.board.squares.map((x) => x.value),
      nextBoardValues = nextBoard.squares.map((x) => x.value)
    for (let i = 0; i < boardSize; i++) {
      if (currentBoardValues[i] !== nextBoardValues[i]) return true
    }
    return false
  }

  start() {
    this.score = 0
    this.#isOver = false
    this.#clearBoard()
    this.#clearMovements()
    this.#spawnBlock(this.board)
    this.#spawnBlock(this.board)
    this.#updateGameState()
  }
}
