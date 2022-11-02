import Board from './Board'
import { orderBy } from 'lodash'

const ResolvedPromise = () => new Promise(resolve => resolve())

export default class GameController {
  score = 0
  #win = false
  #isOver = true
  board = null
  #updateTimeout = null

  canMoveRight = false
  canMoveLeft = false
  canMoveUp = false
  canMoveDown = false

  constructor(size = 4, updateDelay = 0) {
    this.size = size
    this.updateDelay = updateDelay
    this.#clearBoard()
  }

  get isGameOver(){
    return this.#isOver
  }

  get winner(){
    return this.#win
  }

  #checkMoveRight() {
    const nextBoard = this.#moveRight()[0]
    this.canMoveRight =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  #checkMoveLeft() {
    const nextBoard = this.#moveLeft()[0]
    this.canMoveLeft =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  #checkMoveUp() {
    const nextBoard = this.#moveUp()[0]
    this.canMoveUp =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  #checkMoveDown() {
    const nextBoard = this.#moveDown()[0]
    this.canMoveDown =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  spawnBlock(board) {
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

  #moveRight(storeMovement = false) {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['col'], ['desc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        'right'
      )
      if (nextRow != null || nextCol != null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (storeMovement) sqr.setMove(sqr.row - nextRow, sqr.col - nextCol)
      }
    })
    return [nextBoard, score]
  }

  #moveLeft(storeMovement = false) {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['col'], ['asc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        'left'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (storeMovement) sqr.setMove(sqr.row - nextRow, sqr.col - nextCol)
      }
    })
    return [nextBoard, score]
  }

  #moveUp(storeMovement = false) {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['row'], ['asc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        'up'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (storeMovement) sqr.setMove(sqr.row - nextRow, sqr.col - nextCol)
      }
    })
    return [nextBoard, score]
  }

  #moveDown(storeMovement = false) {
    const nextBoard = new Board(this.size)
    let score = 0
    orderBy(this.board.filledSquares, ['row'], ['desc']).forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        'down'
      )
      if (nextRow !== null || nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        score += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (storeMovement) sqr.setMove(sqr.row - nextRow, sqr.col - nextCol)
      }
    })
    return [nextBoard, score]
  }

  updateGameState() {
    if(!this.#win && this.board.highestValue >= 2048){
      this.#win = true;
    }

    this.#checkMoveRight()
    this.#checkMoveLeft()
    this.#checkMoveUp()
    this.#checkMoveDown()

    if (
      !this.canMoveUp &&
      !this.canMoveDown &&
      !this.canMoveRight &&
      !this.canMoveLeft
    ) {
      this.#isOver = true
    }
  }

  #updateBoard(nextBoard, nextScore, spawnBlock) {
    this.score += nextScore
    this.#updateTimeout = null
    if(spawnBlock)
      this.spawnBlock(nextBoard)
    this.board = nextBoard
    this.updateGameState()
  }

  move(dir, shouldSpawnAfter = true) {
    if (this.#updateTimeout) return ResolvedPromise()
    let nextBoard, nextScore
    switch (dir) {
      case 'right':
        if(this.canMoveRight) {
          [nextBoard, nextScore] = this.#moveRight(true)
          break
        }
        else return ResolvedPromise()
      case 'left':
        if(this.canMoveLeft) {
          [nextBoard, nextScore] = this.#moveLeft(true)
          break
        }
        else return ResolvedPromise()
      case 'up':
        if(this.canMoveUp){
          [nextBoard, nextScore] = this.#moveUp(true)
          break
        }
        else return ResolvedPromise()
      case 'down':
        if(this.canMoveDown){
          [nextBoard, nextScore] = this.#moveDown(true)
          break
        }
        else return ResolvedPromise()
    }

    return new Promise((resolve) => {
      this.#updateTimeout = setTimeout(() => {
        this.#updateBoard(nextBoard, nextScore, shouldSpawnAfter)
        resolve()
      }, this.updateDelay)
    })
  }

  start() {
    this.score = 0
    this.#isOver = false
    this.#win = false
    this.#clearBoard()
    this.spawnBlock(this.board)
    this.spawnBlock(this.board)
    this.updateGameState()
  }
}
