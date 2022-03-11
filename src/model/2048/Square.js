export default class Square {
  willMerge = true

  nextMove = {
    spawn: false,
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

  setSpawn() {
    this.nextMove.spawn = true;
  }

  setMove(vertical, horizontal) {
    this.nextMove.vertical = vertical
    this.nextMove.horizontal = horizontal
  }
}