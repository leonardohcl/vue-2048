import IBoard from '../../../2048/interfaces/Board'

export interface IGameState {
  paused: boolean
  history: { board: IBoard; pointsGained: number }[]
  board: IBoard
}
