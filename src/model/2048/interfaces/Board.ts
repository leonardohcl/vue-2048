export default interface IBoard {
  width: number
  height: number
  squares: {
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
  }[]
}
