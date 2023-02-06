import { IGame } from "@/model/2048/interfaces/Game";
import IBoard from "@/model/2048/interfaces/Board";

export default interface IGameController extends IGame {
    endless: boolean
    undos: number
    moves: number
    updateDelay: number
    historySize: number
    paused: boolean
    history: { board: IBoard, pointsGained: number }[]
}