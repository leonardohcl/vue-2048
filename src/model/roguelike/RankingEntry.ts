import RankingEntry, { IRankingEntry } from '../2048/RankingEntry'

export interface IRoguelikeRankingEntry extends IRankingEntry {
  run: number
}

export default class RoguelikeRankingEntry
  extends RankingEntry
  implements IRoguelikeRankingEntry {
  run = 0

  static getMock(): RoguelikeRankingEntry {
    const entry = RankingEntry.getMock() as RoguelikeRankingEntry
    entry.run = Math.round(Math.random() * 200)
    return entry;
  }
}
