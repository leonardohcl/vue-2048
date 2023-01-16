import { computed } from 'vue'
import { useStore } from 'vuex'

export function useRanking() {
  const store = useStore()

  return computed(() => store.getters.availableRankings)
}

export function useHighScore(game) {
  const availableRankings = useRanking()
  return computed(() => {
    const ranking = availableRankings.value.find(
      (list) => list.name === `${game.width}x${game.height}`
    )
    if (ranking)
      return {
        first: ranking.scores[0].score,
        last: ranking.scores[ranking.scores.length - 1].score,
        count: ranking.scores.length,
      }

    return {
      first: 0,
      last: 0,
      count: 0,
    }
  })
}
