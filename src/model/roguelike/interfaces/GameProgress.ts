import GameProgress, {
  IGameProgress,
} from '@/model/2048/interfaces/GameProgress'

export interface IRoguelikeGameProgress extends IGameProgress {
  run?: number
}

export default class RoguelikeGameProgress implements IRoguelikeGameProgress {
  score
  undos
  moves
  highestBlock
  run

  constructor(
    { score = 0, undos = 0, moves = 0, highestBlock = 0, run = 0 }: IRoguelikeGameProgress = {}) {
    this.score = score
    this.undos = undos
    this.moves = moves
    this.highestBlock = highestBlock
    this.run = run
  }

}
