import { createStore } from 'vuex'
import wallet from './wallet'
import ranking from './ranking'
import memoryCard from './memory-card'

export default createStore({
  modules: {
    memoryCard,
    ranking,
    wallet
  },
})
