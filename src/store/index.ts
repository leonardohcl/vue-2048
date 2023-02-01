import { createStore } from 'vuex'
import ranking, { IRanking } from './ranking'
import memoryCard, { IMemoryCard } from './memory-card'

export interface IStore {
  memoryCard: IMemoryCard, ranking: IRanking
}

export default createStore<IStore>({
  modules: {
    memoryCard,
    ranking,
  },
})
