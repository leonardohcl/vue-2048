export default class Square {
  nextMove = {
    vertical: 0,
    horizontal: 0,
  }

  constructor(row, col, value = 0) {
    this.value = value
    this.row = row
    this.col = col
  }

  get isEmpty() {
    return this.value === 0
  }

  get coord() {
    return `${this.row}, ${this.col}`
  }

  setValue(value) {
    this.value = value
  }

  setMove(vertical, horizontal) {
    this.nextMove.vertical = vertical
    this.nextMove.horizontal = horizontal
  }
}
