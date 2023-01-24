import GameProgress, {
  IGameProgress,
} from '@/model/2048/interfaces/GameProgress'

export interface IRogueGameProgress extends IGameProgress {
  bestScore: number
  run: number
}

export default class RogueGameProgress implements IRogueGameProgress {
  score = 0
  undos = 0
  moves = 0
  highestValue = 0
  run = 0
  bestScore = 0

  constructor(
    gameProgress: IRogueGameProgress = {
      bestScore: 0,
      score: 0,
      undos: 0,
      moves: 0,
      highestValue: 0,
      run: 0,
    }
  ) {
    this.score = gameProgress.score
    this.undos = gameProgress.undos
    this.moves = gameProgress.moves
    this.highestValue = gameProgress.highestValue
    this.run = gameProgress.run
    this.bestScore = gameProgress.bestScore
  }
}
