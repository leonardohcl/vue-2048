export default interface ISquare {
  row: number
  col: number
  value: number
  willMerge: boolean
  nextMove: {
    spawn: boolean
    reverse: boolean
    vertical: number
    horizontal: number
  }
}
