export interface IWallet {
  coins: number
}

export const UPDATE_BALANCE = 'UPDATE COINS MUTATION'
export const SET_COINS = 'SET COINS MUTATION'

export default {
  state: {
    coins: 0,
  },
  getters: {
    currentCoins(state: IWallet) {
      return state.coins
    },
  },
  mutations: {
    [UPDATE_BALANCE](state: IWallet, amount: number) {
      state.coins += amount
    },
    [SET_COINS](state: IWallet, amount: number) {
      state.coins = amount
    },
  },
}
