import Square from './Square'

export default class Game {
  score = 0
  isOver = true
  board = []

  constructor(size = 4) {
    this.size = size
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
      const movement = Square.getMovementToTheRight(squares[i], this.board)
      if (movement !== null) return true
    }
    return false
  }

  get canMoveLeft() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovementToTheLeft(squares[i], this.board)
      if (movement !== null) return true
    }
    return false
  }

  get canMoveDown() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovementDownwards(squares[i], this.board)
      if (movement !== null) return true
    }
    return false
  }

  get canMoveUp() {
    const squares = this.#filledSquares
    for (let i = 0; i < squares.length; i++) {
      const movement = Square.getMovementUpwards(squares[i], this.board)
      if (movement !== null) return true
    }
    return false
  }

  #spawnBlock() {
    const options = this.#emptySquares
    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

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

  #moveSquare(sqr, target) {
    if (target == null) return

    // console.log(`${sqr.row},${sqr.col} -> ${target.row},${target.col}`)

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
        const selectedMovement = Square.getMovementToTheRight(sqr, this.board)

        this.#moveSquare(sqr, selectedMovement)
      })
  }

  #moveLeft() {
    if (!this.canMoveLeft) return
    this.#filledSquares
      .sort((a, b) => a.col - b.col)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovementToTheLeft(sqr, this.board)

        this.#moveSquare(sqr, selectedMovement)
      })
  }

  #moveUp() {
    if (!this.canMoveUp) return
    this.#filledSquares
      .sort((a, b) => a.row - b.row)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovementUpwards(sqr, this.board)

        this.#moveSquare(sqr, selectedMovement)
      })
  }

  #moveDown() {
    if (!this.canMoveDown) return
    this.#filledSquares
      .sort((a, b) => b.row - a.row)
      .forEach((sqr) => {
        const selectedMovement = Square.getMovementDownwards(sqr, this.board)

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
    this.#checkGameState()
  }

  start() {
    this.score = 0
    this.isOver = false
    this.#clearBoard()
    this.#spawnBlock()
    this.#spawnBlock()
  }
}
