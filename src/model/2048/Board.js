import Square from './Square'
import { orderBy } from 'lodash'

export default class Board {
  constructor(width, height, preset = null) {
    this.width = width
    this.height = height
    this.squares = new Array(this.width * this.height).fill().map((_, ind) => {
      const row = Math.floor(ind / this.width) % this.height,
        col = ind % this.width
      return new Square(row, col)
    })
    this.loadPreset(preset)
  }

  get emptySquares() {
    return this.squares.filter((square) => square.isEmpty === true)
  }

  get filledSquares() {
    return this.squares.filter((square) => square.isEmpty === false)
  }

  get highestValue() {
    const orderedList = orderBy(this.filledSquares, 'value', 'desc')

    return orderedList.length ? orderedList[0].value : 0
  }

  get flat() {
    return this.squares.map((sqr) => sqr.value)
  }

  loadPreset(preset) {
    if (preset && preset.length === this.squares.length)
      preset.forEach((val, idx) => {
        this.squares[idx].setValue(val)
      })
  }

  static fromObject(obj) {
    const board = new Board(obj.width, obj.height)
    board.squares = obj.squares.map((sqr) => Square.fromObject(sqr))
    return board
  }

  clone() {
    const copy = new Board(this.width, this.height)
    copy.squares = this.squares.map((square) => square.clone())
    return copy
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

  getSquareValidMovement(row, col, dir) {
    const sqr = this.getSquare(row, col)
    let neighbor = this.getSquareNeighbor(row, col, dir),
      selectedNeighbor = null
    while (neighbor != null) {
      if (neighbor.value == sqr.value) {
        if (neighbor.willMerge) {
          selectedNeighbor = neighbor
        }
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

  updateSquare(row, col, val) {
    const sqr = this.getSquare(row, col)
    if (sqr) {
      if (sqr.value == val) {
        sqr.willMerge = false
        sqr.setValue(sqr.value + val)
        return sqr.value
      } else {
        sqr.setValue(val)
      }
    }
    return 0
  }
}
