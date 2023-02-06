import { createStore } from 'vuex'
import ranking, { IRanking } from './ranking'

export interface IStore {
  ranking: IRanking
}

export default createStore<IStore>({
  modules: {
    ranking,
  },
})
