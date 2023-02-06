export interface IGameProgress {
  score: number
  undos: number
  moves: number
  highestBlock: number
}

export interface IRoguelikeGameProgress extends IGameProgress {
  run: number
}
