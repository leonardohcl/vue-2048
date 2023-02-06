import Square from './Square'
import { orderBy } from 'lodash'
import { MoveDirection } from './interfaces/Game'
import IBoard from './interfaces/Board'
import { deepCopy } from '../../utils/copy'
import { SquareStateMeta } from './interfaces/Square'

export default class Board implements IBoard {
  private _width = 0
  private _height = 0

  squares = [] as Square[]

  toString() {
    const highestValue = this.highestBlock
    let maxSize = highestValue < 10 ? 1 : highestValue < 100 ? 2 : highestValue < 1000 ? 3 : 4
    const board = this.flat
    const rows = []
    for (let row = 0; row < this._height; row++) {
      const rowStart = row * this._width, rowEnd = rowStart + this._width
      const rowText = board.slice(rowStart, rowEnd).map(x => `${x}`.padStart(5).slice(-maxSize))
      rows.push(rowText)
    }
    return rows.join("\n")
  }

  get width() { return this._width }
  get height() { return this._height }
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
    return this._width * this._height
  }

  private isValidCoords(row: number, col: number) {
    if (row < 0 || col < 0) return false
    if (row >= this._height) return false
    if (col >= this._width) return false
    return true
  }

  private isValidIdx(idx: number) {
    return idx >= 0 && idx < this.length
  }

  private getCoordFromIdx(idx: number) {
    if (!this.isValidIdx(idx)) return { row: -1, col: -1 }
    const row = Math.floor(idx / this._width) % this._height,
      col = idx % this._width
    return { row, col }
  }

  private getIdxFromCoord(row: number, col: number) {
    if (!this.isValidCoords(row, col)) return -1
    const rowIdx = row * this._width
    const colIdx = col % this._width
    return rowIdx + colIdx
  }

  private getSquareNeighbor(row: number, col: number, dir: MoveDirection) {
    if (!this.isValidCoords(row, col)) return
    switch (dir) {
      case MoveDirection.Right:
        return this.getSquare(row, col + 1)
      case MoveDirection.Left:
        return this.getSquare(row, col - 1)
      case MoveDirection.Up:
        return this.getSquare(row - 1, col)
      case MoveDirection.Down:
        return this.getSquare(row + 1, col)
    }
  }

  loadPreset(preset: number[]) {
    if (preset.length === this.squares.length)
      preset.forEach((val, idx) => {
        this.squares[idx].setValue(val)
      })
  }

  getSnapshot(): IBoard {
    return {
      height: this._height,
      width: this._width,
      squares: this.squares.map(sqr => sqr.getSnapshot())
    }
  }

  getSquare(row: number, col: number) {
    const idx = this.getIdxFromCoord(row, col)
    return this.squares[idx]
  }

  getSquareValidMovement(row: number, col: number, dir: MoveDirection) {
    const sqr = this.getSquare(row, col)
    if (!sqr) return [undefined, undefined]
    let neighbor = this.getSquareNeighbor(row, col, dir),
      selectedNeighbor = null
    while (neighbor) {
      if (neighbor.value === sqr.value) {
        if (!neighbor.meta[SquareStateMeta.Merged]) {
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
        sqr.setMeta(SquareStateMeta.Merged, true)
        sqr.setValue(sqr.value + val)
        return sqr.value
      } else {
        sqr.setValue(val)
      }
    }
    return 0
  }

  constructor(width: number, height: number, preset?: number[]) {
    this._width = width
    this._height = height
    this.squares = new Array(this.length).fill(0).map((_, idx) => {
      const { row, col } = this.getCoordFromIdx(idx)
      return new Square(row, col)
    }
    )
    if (preset) this.loadPreset(preset)
  }

  static fromObject(obj: IBoard) {
    const board = new Board(obj.width, obj.height)
    board.squares = obj.squares.map((sqr) => Square.fromObject(sqr))
    return board
  }
}
