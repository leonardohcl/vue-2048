import RankingEntry, { IRankingEntry } from '../2048/RankingEntry'

export interface IRoguelikeRankingEntry extends IRankingEntry {
  run: number
}

export default class RoguelikeRankingEntry
  extends RankingEntry
  implements IRoguelikeRankingEntry
{
  run = 0
}
