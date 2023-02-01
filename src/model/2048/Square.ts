import LooseObject from '@/utils/LooseObject'
import ISquare, { ISquareMove } from './interfaces/Square'

export default class Square implements ISquare {
  canMerge = true

  value = 0
  row = 0
  col = 0
  isSpawn = false
  isMerged = false

  nextMove = {
    reverse: false,
    vertical: 0,
    horizontal: 0,
  }

  customStates: LooseObject = {}

  constructor(row: number, col: number, value: number = 0) {
    this.value = value
    this.row = row
    this.col = col
  }

  get id() {
    return `s${this.row}x${this.col}`
  }

  get isEmpty() {
    return this.value === 0
  }

  get coord() {
    return `${this.row}, ${this.col}`
  }

  clone() {
    const copy = new Square(this.row, this.col, this.value)
    copy.canMerge = this.canMerge
    copy.isSpawn = this.isSpawn
    copy.nextMove = { ...this.nextMove }
    return copy
  }

  setValue(value: number) {
    this.value = value
  }

  setSpawn(resetAfter = 0) {
    this.isSpawn = true
    if (resetAfter)
      setTimeout(() => {
        this.isSpawn = false
      }, resetAfter)
  }

  setMove(move: ISquareMove) {
    this.nextMove = { ...this.nextMove, ...move }
  }

  static fromObject(obj: ISquare) {
    const sqr = new Square(obj.row ?? 0, obj.col ?? 0, obj.value)
    sqr.canMerge = obj.canMerge
    sqr.isSpawn = obj.isSpawn
    sqr.setMove(obj.nextMove)
    return sqr
  }
}
