import Vue from 'vue'
import Vuex from 'vuex'
import robots from './robots'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    robots,
  },
})
