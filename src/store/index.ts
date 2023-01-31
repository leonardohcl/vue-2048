import { createStore } from 'vuex'
import ranking from './ranking'
import memoryCard from './memory-card'

export default createStore({
  modules: {
    memoryCard,
    ranking,
  },
})
