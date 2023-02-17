import { deepCopy } from '../../utils/copy'
import LooseObject from '../../utils/LooseObject'
import ISquare from './interfaces/Square'

export default class Square implements ISquare {
  private _value = 0
  private _row = 0
  private _col = 0

  meta: LooseObject = {}

  get id() {
    return `s${this._row}x${this._col}`
  }
  get isEmpty() {
    return this._value === 0
  }
  get col() {
    return this._col
  }
  get row() {
    return this._row
  }
  get value() {
    return this._value
  }

  getSnapshot(): ISquare {
    return {
      value: this._value,
      row: this._row,
      col: this._col,
      meta: deepCopy(this.meta),
    }
  }

  setValue(value: number) {
    this._value = value
  }

  setMeta(key: string, value: any) {
    this.meta[key] = value
  }

  static fromObject(obj: ISquare) {
    const sqr = new Square(obj.row ?? 0, obj.col ?? 0, obj.value, obj.meta)
    return sqr
  }

  constructor(
    row: number,
    col: number,
    value: number = 0,
    meta: LooseObject = {}
  ) {
    this._value = value
    this._row = row
    this._col = col
    this.meta = deepCopy(meta)
  }
}
