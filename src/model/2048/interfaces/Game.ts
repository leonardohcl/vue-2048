import IBoard from "./Board"
import Square from "../Square"

export const enum MoveDirection {
    Up = 'up',
    Down = 'down',
    Right = 'right',
    Left = 'left',
}

export interface IGame {
    score: number
    width: number
    height: number
    winningBlock: number
    board: IBoard
    winner: boolean
    gameOver: boolean
    canMove: {
        [MoveDirection.Up]: boolean,
        [MoveDirection.Down]: boolean,
        [MoveDirection.Left]: boolean,
        [MoveDirection.Right]: boolean,
    }
}

export type onUpdateSquareFn = (square: Square, next: { nextRow: number, nextCol: number }) => void