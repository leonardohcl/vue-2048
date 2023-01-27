export default interface ISquare {
  row: number
  col: number
  value: number
  isSpawn: boolean
  willMerge: boolean
  nextMove: {
    reverse: boolean
    vertical: number
    horizontal: number
  }
}
