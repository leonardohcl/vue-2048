export interface IRankingEntry {
  id: string
  name: string
  score: number
  block: number
  moves: number
  undos: number
  width: number
  height: number
}

export default class RankingEntry implements IRankingEntry {
  id = ''
  name = ''
  score = 0
  block = 0
  moves = 0
  undos = 0
  width = 0
  height = 0

  constructor({
    id,
    name,
    score = 0,
    block = 0,
    moves = 0,
    undos = 0,
    width = 0,
    height = 0,
  }: IRankingEntry) {
    this.id = id
    this.name = name
    this.score = score
    this.block = block
    this.moves = moves
    this.undos = undos
    this.width = width
    this.height = height
  }
}
