import { createStore } from 'vuex'
import ranking, { IRanking } from './ranking'
import memoryCard, { IMemoryCardStore } from './memory-card'

export interface IStore {
  memoryCard: IMemoryCardStore, ranking: IRanking
}

export default createStore<IStore>({
  modules: {
    memoryCard,
    ranking,
  },
})
