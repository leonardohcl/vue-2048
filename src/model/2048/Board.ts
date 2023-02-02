import Square from './Square'
import { orderBy } from 'lodash'
import Direction from './Direction'
import IBoard from './interfaces/Board'

export default class Board implements IBoard {
  width = 0
  height = 0
  squares = [] as Square[]

  constructor(width: number, height: number, preset?: number[]) {
    this.width = width
    this.height = height
    this.squares = new Array(this.width * this.height).fill(0).map((_, idx) => {
      const { row, col } = this.getCoordFromIdx(idx)
      return new Square(row, col)
    }
    )
    if (preset) this.loadPreset(preset)
  }

  toString() {
    const highestValue = this.highestBlock
    let maxSize = highestValue < 10 ? 1 : highestValue < 100 ? 2 : highestValue < 1000 ? 3 : 4
    const board = this.flat
    const rows = []
    for (let row = 0; row < this.height; row++) {
      const rowStart = row * this.width, rowEnd = rowStart + this.width
      const rowText = board.slice(rowStart, rowEnd).map(x => `${x}`.padStart(5).slice(-maxSize))
      rows.push(rowText)
    }
    return rows.join("\n")
  }

  get emptySquares() {
    return this.squares.filter((square) => square.isEmpty === true)
  }

  get filledSquares() {
    return this.squares.filter((square) => square.isEmpty === false)
  }

  get highestBlock() {
    const orderedList = orderBy(this.filledSquares, 'value', 'desc')

    return orderedList.length ? orderedList[0].value : 0
  }

  get flat() {
    return this.squares.map((sqr) => sqr.value)
  }

  get length() {
    return this.width * this.height
  }

  isValidCoords(row: number, col: number) {
    if (row < 0 || col < 0) return false
    if (row >= this.height) return false
    if (col >= this.width) return false
    return true
  }

  isValidIdx(idx: number) {
    return idx >= 0 && idx < this.length
  }

  getCoordFromIdx(idx: number) {
    if (!this.isValidIdx(idx)) return { row: -1, col: -1 }
    const row = Math.floor(idx / this.width) % this.height,
      col = idx % this.width
    return { row, col }
  }

  getIdxFromCoord(row: number, col: number) {
    if (!this.isValidCoords(row, col)) return -1
    const rowIdx = row * this.width
    const colIdx = col % this.width
    return rowIdx + colIdx
  }

  loadPreset(preset: number[]) {
    if (preset.length === this.squares.length)
      preset.forEach((val, idx) => {
        this.squares[idx].setValue(val)
      })
  }

  static fromObject(obj: IBoard) {
    const board = new Board(obj.width, obj.height)
    board.squares = obj.squares.map((sqr) => Square.fromObject(sqr))
    return board
  }

  clone() {
    const copy = new Board(this.width, this.height)
    copy.squares = this.squares.map((square) => square.clone())
    return copy
  }

  getSquare(row: number, col: number) {
    const idx = this.getIdxFromCoord(row, col)
    return this.squares[idx]
  }

  getSquareNeighbor(row: number, col: number, dir: Direction) {
    if (!this.isValidCoords(row, col)) return
    switch (dir) {
      case Direction.Right:
        return this.getSquare(row, col + 1)
      case Direction.Left:
        return this.getSquare(row, col - 1)
      case Direction.Up:
        return this.getSquare(row - 1, col)
      case Direction.Down:
        return this.getSquare(row + 1, col)
    }
  }

  getSquareValidMovement(row: number, col: number, dir: Direction) {
    const sqr = this.getSquare(row, col)
    if (!sqr) return [undefined, undefined]
    let neighbor = this.getSquareNeighbor(row, col, dir),
      selectedNeighbor = null
    while (neighbor) {
      if (neighbor.value === sqr.value) {
        if (neighbor.canMerge) {
          selectedNeighbor = neighbor
        }
        break
      } else if (neighbor.isEmpty) {
        selectedNeighbor = neighbor
      } else {
        break
      }
      neighbor = this.getSquareNeighbor(neighbor.row, neighbor.col, dir)
    }
    return [selectedNeighbor?.row, selectedNeighbor?.col]
  }

  updateSquare(row: number, col: number, val: number) {
    const sqr = this.getSquare(row, col)
    if (sqr) {
      if (sqr.value == val) {
        sqr.canMerge = false
        sqr.setValue(sqr.value + val)
        return sqr.value
      } else {
        sqr.setValue(val)
      }
    }
    return 0
  }
}
