import Square from './Square'

export default class Board {
  constructor(size) {
    this.size = size
    this.squares = new Array(this.size * this.size).fill().map((x, ind) => {
      const row = Math.floor(ind / this.size),
        col = ind % this.size
      return new Square(row, col)
    })
  }

  get emptySquares() {
    return this.squares.filter((square) => square.isEmpty === true)
  }

  get filledSquares() {
    return this.squares.filter((square) => square.isEmpty === false)
  }

  updateSquare(row, col, val) {
    const sqr = this.getSquare(row, col)
    if (sqr) {
      if (sqr.value == val) {
        sqr.setValue(sqr.value + val)
        return sqr.value
      } else {
        sqr.setValue(val)
      }
    }
    return 0
  }

  getSquare(row, col) {
    return this.squares.find((sqr) => sqr.row == row && sqr.col == col)
  }

  getSquareNeighbor(row, col, dir) {
    switch (dir) {
      case 'right':
        return this.getSquare(row, col + 1)
      case 'left':
        return this.getSquare(row, col - 1)
      case 'up':
        return this.getSquare(row - 1, col)
      case 'down':
        return this.getSquare(row + 1, col)
    }
  }

  getValidMovement(row, col, dir) {
    const sqr = this.getSquare(row, col)
    let neighbor = this.getSquareNeighbor(row, col, dir),
      selectedNeighbor = null
    while (neighbor != null) {
      if (neighbor.value == sqr.value) {
        selectedNeighbor = neighbor
        break
      } else if (neighbor.value == 0) {
        selectedNeighbor = neighbor
      } else {
        break
      }
      neighbor = this.getSquareNeighbor(neighbor.row, neighbor.col, dir)
    }

    return selectedNeighbor
      ? [selectedNeighbor.row, selectedNeighbor.col]
      : [null, null]
  }
}
