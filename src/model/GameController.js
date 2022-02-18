import Square from './Square'

class Movement{
  constructor(originRow, originCol, originVal,targetRow, targetCol, targetVal){
    this.origin = {
      row: originRow,
      col: originCol,
      value: originVal
    }
    this.target = {
      row: targetRow,
      col:targetCol,
      value: targetVal
    }
  }

  get isMerge(){
    return this.target.value !== 0
  }

  get isSpawn(){
    return this.target.col == this.origin.col && this.target.row == this.origin.row
  }
}

export default class GameController {
  score = 0
  isOver = true
  board = []
  movementHistory = []
  #currentMovements = []

  constructor(size = 4, historySize = 3) {
    this.size = size
    this.historySize = historySize
    this.#clearBoard()
  }

  get #emptySquares() {
    return this.board.filter((square) => square.isEmpty === true)
  }

  get #filledSquares() {
    return this.board.filter((square) => square.isEmpty === false)
  }

  get canMoveRight() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovement(squares[i], this.board, "right")
      if (movement !== null) return true
    }
    return false
  }

  get canMoveLeft() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovement(squares[i], this.board, "left")
      if (movement !== null) return true
    }
    return false
  }

  get canMoveDown() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovement(squares[i], this.board, "down")
      if (movement !== null) return true
    }
    return false
  }

  get canMoveUp() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovement(squares[i], this.board, "up")
      if (movement !== null) return true
    }
    return false
  }

  #getSquare(row,col){
    return this.board.find(x => x.col == col && x.row == row)
  }

  #spawnBlock() {
    const options = this.#emptySquares
    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

    this.#storeMovement(options[selectedIndex], options[selectedIndex])

    if (Math.random() > 0.1) options[selectedIndex].setValue(2)
    else options[selectedIndex].setValue(4)
  }

  #clearBoard() {
    this.board = new Array(this.size * this.size).fill().map((x, ind) => {
      const row = Math.floor(ind / this.size),
        col = ind % this.size
      return new Square(row, col)
    })
  }

  #clearMergedFlags() {
    this.board.filter((sqr) => sqr.merged).forEach((sqr) => sqr.mergeComplete())
  }

  #storeMovement(origin, target){
    this.#currentMovements.push(new Movement(origin.row, origin.col, origin.value, target.row, target.col, target.value))
  }

  #updateHistory(){
    this.movementHistory.push([...this.#currentMovements])
    this.movementHistory = this.movementHistory.slice(-this.historySize)
    this.#currentMovements = []
  }

  #moveSquare(sqr,target) {    
    if (target == null) return

    this.#storeMovement(sqr,target)

    if (target.value !== 0) {
      target.merge()
      this.score += sqr.value + sqr.value
    } else {
      target.setValue(sqr.value)
    }
    sqr.setValue(0)
  }

  #moveRight() {
    if (!this.canMoveRight) return
    this.#filledSquares
      .sort((a, b) => b.col - a.col)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovement(sqr, this.board, "right")
        this.#moveSquare(sqr, selectedMovement)
      })
  }

  #moveLeft() {
    if (!this.canMoveLeft) return
    this.#filledSquares
      .sort((a, b) => a.col - b.col)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovement(sqr, this.board, "left")
        this.#moveSquare(sqr, selectedMovement)

      })
  }

  #moveUp() {
    if (!this.canMoveUp) return
    this.#filledSquares
      .sort((a, b) => a.row - b.row)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovement(sqr, this.board, "up")
        this.#moveSquare(sqr, selectedMovement)

      })
  }

  #moveDown() {
    if (!this.canMoveDown) return
    this.#filledSquares
      .sort((a, b) => b.row - a.row)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovement(sqr, this.board, "down")
        this.#moveSquare(sqr, selectedMovement)
      })
  }

  #checkGameState() {
    if (
      !this.canMoveUp &&
      !this.canMoveDown &&
      !this.canMoveRight &&
      !this.canMoveLeft
    ) {
      console.log('Game Over')
      this.isOver = true
    }
  }

  undo(){
    if(this.isOver) return;
    const lastMovements = this.movementHistory.pop()
    lastMovements.forEach(move => {

      const origin = this.#getSquare(move.origin.row, move.origin.col), 
            target = this.#getSquare(move.target.row, move.target.col)

      if(move.isMerge){
        this.score -= move.origin.value + move.target.value
      }

      origin.setValue(move.origin.value)
      target.setValue(move.target.value)
      
    })
  }

  move(dir) {
    switch (dir) {
      case 'right':
        this.#moveRight()
        break
      case 'left':
        this.#moveLeft()
        break
      case 'up':
        this.#moveUp()
        break
      case 'down':
        this.#moveDown()
        break
    }

    this.#clearMergedFlags()
    this.#spawnBlock()
    this.#updateHistory()
    this.#checkGameState()
  }

  start() {
    this.score = 0
    this.isOver = false
    this.movementHistory = []
    this.#clearBoard()
    this.#spawnBlock()
    this.#spawnBlock()
    this.#currentMovements = []
  }
}
