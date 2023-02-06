import GameProgress, {
  IGameProgress,
} from '@/model/2048 Standard/partials/GameProgress'

export interface IRoguelikeGameProgress extends IGameProgress {
  run?: number
}

export default class RoguelikeGameProgress extends GameProgress implements IRoguelikeGameProgress {
  run

  constructor(
    { score = 0, undos = 0, moves = 0, highestBlock = 0, run = 0 }: IRoguelikeGameProgress = {}) {
    super({ score, undos, moves, highestBlock })
    this.run = run
  }

}
