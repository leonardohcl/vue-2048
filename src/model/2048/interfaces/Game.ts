import Board from "../Board"
import Direction from "../Direction"
import ISquare from "./Square"

export interface IGame {
    score: number
    width: number
    height: number
    winningBlock: number
    board: Board
    winner: boolean
    gameOver: boolean
    canMove: {
        [Direction.Up]: boolean,
        [Direction.Down]: boolean,
        [Direction.Left]: boolean,
        [Direction.Right]: boolean,
    }
}

export type onUpdateSquareFn = (square: ISquare, next: { nextRow: number, nextCol: number }) => void