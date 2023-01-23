export const UPDATE_BALANCE = "UPDATE COINS"

export default {
  state: {
    coins: 0,
  },
  getters: {
    currentCoins(state) {
      return state.coins
    },
  },
  mutations: {
    [UPDATE_BALANCE](state, amount){
        state.coins += amount
    },
  }
}
