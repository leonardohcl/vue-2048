export default class Square {
  willMerge = true

  nextMove = {
    spawn: false,
    reverse: false,
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

  clone(){
    const copy = new Square(this.row, this.col, this.value);
    copy.nextMove = {...this.nextMove}
    return copy;
  }

  setValue(value) {
    this.value = value
  }

  setSpawn() {
    this.nextMove.spawn = true;
  }

  setMove(move) {
    this.nextMove = {...this.nextMove, ...move}
  }

  static fromObject(obj){
    const sqr = new Square(obj.row, obj.col, obj.value)
    sqr.willMerge = obj.willMerge
    sqr.setMove(obj.move) 
    return sqr
  }
}