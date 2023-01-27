import ISquare from "./Square"

export default interface IBoard {
  width: number
  height: number
  squares: ISquare[]
}
