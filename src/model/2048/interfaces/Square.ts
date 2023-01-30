export interface ISquareMove {
  reverse?: boolean
  vertical?: number
  horizontal?: number
}

export default interface ISquare {
  row: number
  col: number
  value: number
  isSpawn: boolean
  willMerge: boolean
  nextMove: ISquareMove

  setMove: (move: ISquareMove) => void
  setSpawn: () => void
}

