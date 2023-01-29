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

  static getMock(): RankingEntry {
    return new RankingEntry({
      id: 'mock',
      name: 'mock player',
      block: Math.pow(2, Math.round(Math.random() * 12)),
      score: Math.round(Math.random() * 20000),
      moves: Math.round(Math.random() * 250),
      undos: Math.round(Math.random() * 10),
      width: 3 + Math.round(Math.random() * 5),
      height: 3 + Math.round(Math.random() * 5),
    })
  }
}
