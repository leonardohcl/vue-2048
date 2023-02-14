export interface ILeaderboardEntry {
  score: number
  block: number
  moves: number
  undos: number
  width: number
  height: number
  run?: number
}

export default class LeaderboardEntry implements ILeaderboardEntry {
  score = 0
  block = 0
  moves = 0
  undos = 0
  width = 0
  height = 0
  run?: number

  constructor({
    score = 0,
    block = 0,
    moves = 0,
    undos = 0,
    width = 0,
    height = 0,
    run = undefined,
  }: ILeaderboardEntry) {
    this.score = score
    this.block = block
    this.moves = moves
    this.undos = undos
    this.width = width
    this.height = height
    this.run = run
  }

  static mock() {
    return new LeaderboardEntry({
      score: 0,
      block: 0,
      moves: 0,
      undos: 0,
      width: 0,
      height: 0,
      run: 0,
    })
  }
}
