import IBoard from "./Board"
import Square from "../Square"

export const enum MoveDirection {
    Up = 'up',
    Down = 'down',
    Right = 'right',
    Left = 'left',
}

export interface IGameActionTracker {
    [MoveDirection.Up]: boolean
    [MoveDirection.Down]: boolean
    [MoveDirection.Right]: boolean
    [MoveDirection.Left]: boolean
  }
  
  export class GameActionTracker implements IGameActionTracker {
    [MoveDirection.Up] = true;
    [MoveDirection.Down] = true;
    [MoveDirection.Left] = true;
    [MoveDirection.Right] = true
  }
  

export interface IGame {
    score: number
    width: number
    height: number
    winningBlock: number
    board: IBoard
    winner: boolean
    gameOver: boolean
    canMove: IGameActionTracker
}

export type onUpdateSquareFn = (square: Square, next: { nextRow: number, nextCol: number }) => void