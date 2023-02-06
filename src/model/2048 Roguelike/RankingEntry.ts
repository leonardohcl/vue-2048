import RankingEntry, { IRankingEntry } from '@/model/2048 Standard/RankingEntry'

export interface IRoguelikeRankingEntry extends IRankingEntry {
  run: number
}

export default class RoguelikeRankingEntry
  extends RankingEntry
  implements IRoguelikeRankingEntry {
  run 
  
  constructor({
    id,
    name,
    score = 0,
    block = 0,
    moves = 0,
    undos = 0,
    width = 0,
    height = 0,
    run = 0
  }: IRoguelikeRankingEntry) {
    super({ id, name, score, block, moves, undos, width, height })
    this.run = run
  }
  
  static getMock(): RoguelikeRankingEntry {
    const entry = RankingEntry.getMock() as RoguelikeRankingEntry
    entry.run = Math.round(Math.random() * 200)
    return entry;
  }
}
